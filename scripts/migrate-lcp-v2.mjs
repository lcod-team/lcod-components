#!/usr/bin/env node

/**
 * Migrate legacy LCP descriptors (schemaVersion = "1.0") to the new
 * single-source TOML structure (schemaVersion = "2.0").
 *
 * The new structure collapses the inputs/outputs metadata, documentation
 * snippets and schema references into the `lcp.toml` itself so that all
 * component artefacts can be regenerated deterministically.
 *
 * This script is idempotent: components already on schemaVersion "2.0"
 * are skipped. It preserves existing JSON Schemas and README contents
 * where possible so that no information is lost during the migration.
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import TOML from '@iarna/toml';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const AUTO_SECTIONS = new Set(['inputs', 'outputs', 'slots']);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.lcod', 'dist', 'target'].includes(entry.name)) {
        continue;
      }
      yield* walk(entryPath);
    } else if (entry.isFile() && entry.name === 'lcp.toml') {
      yield entryPath;
    }
  }
}

function stringifyToml(value) {
  return TOML.stringify(value);
}

function extractAdditionalMarkdown(readmeText) {
  if (!readmeText.trim()) return '';
  const lines = readmeText.split(/\r?\n/);
  const kept = [];
  let skipUntilNextHeading = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      // Drop the main title entirely.
      continue;
    }
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      const slug = headingMatch[1].trim().toLowerCase();
      if (AUTO_SECTIONS.has(slug.split(/\s+/)[0])) {
        skipUntilNextHeading = true;
        continue;
      }
      skipUntilNextHeading = false;
    }
    if (skipUntilNextHeading) continue;
    kept.push(line);
  }
  // Trim blank lines at boundaries.
  while (kept.length && kept[0].trim() === '') kept.shift();
  while (kept.length && kept[kept.length - 1].trim() === '') kept.pop();
  return kept.join('\n');
}

function primitiveTypeToSchema(type) {
  switch ((type || '').toLowerCase()) {
    case 'string':
      return { type: 'string' };
    case 'boolean':
      return { type: 'boolean' };
    case 'integer':
      return { type: 'integer' };
    case 'number':
      return { type: 'number' };
    case 'array':
      return { type: 'array' };
    case 'object':
      return { type: 'object' };
    case 'any':
    default:
      return {};
  }
}

function cleanSchemaString(schemaObject) {
  if (!schemaObject || typeof schemaObject !== 'object') {
    return JSON.stringify({}, null, 2);
  }
  return JSON.stringify(schemaObject, null, 2);
}

async function loadJsonIfPresent(relativePath, baseDir) {
  if (!relativePath) return null;
  const absPath = path.join(baseDir, relativePath);
  if (!existsSync(absPath)) return null;
  try {
    const data = JSON.parse(await readFile(absPath, 'utf8'));
    return { data, rel: relativePath, abs: absPath };
  } catch (error) {
    console.warn(`WARN: unable to parse JSON schema at ${relativePath}: ${error.message}`);
    return null;
  }
}

function schemaForProperty(propertyName, schemaJson, fallbackType) {
  if (!schemaJson || typeof schemaJson !== 'object') {
    return cleanSchemaString(primitiveTypeToSchema(fallbackType));
  }
  if (schemaJson.type === 'object' && schemaJson.properties) {
    const propertySchema = schemaJson.properties[propertyName];
    if (propertySchema) {
      return cleanSchemaString(propertySchema);
    }
  }
  return cleanSchemaString(primitiveTypeToSchema(fallbackType));
}

async function migrateFile(filePath) {
  const text = await readFile(filePath, 'utf8');
  let legacy;
  try {
    legacy = TOML.parse(text);
  } catch (error) {
    console.error(`ERROR: cannot parse ${path.relative(repoRoot, filePath)}: ${error.message}`);
    return false;
  }
  const legacyVersion = legacy.schemaVersion ?? '1.0';
  if (legacyVersion === '2.0') {
    return false; // Already migrated.
  }
  if (legacyVersion !== '1.0') {
    console.warn(`WARN: skipping ${path.relative(repoRoot, filePath)} (unexpected schemaVersion: ${legacy.schemaVersion})`);
    return false;
  }

  const dir = path.dirname(filePath);
  const readmePath = path.join(dir, 'README.md');
  let readmeMarkdown = '';
  if (existsSync(readmePath)) {
    readmeMarkdown = await readFile(readmePath, 'utf8');
  }

  const inputSchemaInfo = await loadJsonIfPresent(legacy.tool?.inputSchema, dir);
  const outputSchemaInfo = await loadJsonIfPresent(legacy.tool?.outputSchema, dir);

  const inputs = {};
  const requiredInputs = new Set(
    Array.isArray(inputSchemaInfo?.data?.required)
      ? inputSchemaInfo.data.required
      : []
  );

  if (legacy.io && Array.isArray(legacy.io.input)) {
    for (const entry of legacy.io.input) {
      if (!entry?.name) continue;
      const entryName = entry.name;
      inputs[entryName] = {
        summary: entry.description || '',
        required: Boolean(entry.required),
        schema: schemaForProperty(entryName, inputSchemaInfo?.data || null, entry.type),
      };
      if (requiredInputs.has(entryName)) {
        inputs[entryName].required = true;
      }
    }
  }

  const outputs = {};
  const requiredOutputs = new Set(
    Array.isArray(outputSchemaInfo?.data?.required)
      ? outputSchemaInfo.data.required
      : []
  );
  if (legacy.io && Array.isArray(legacy.io.output)) {
    for (const entry of legacy.io.output) {
      if (!entry?.name) continue;
      const entryName = entry.name;
      outputs[entryName] = {
        summary: entry.description || '',
        schema: schemaForProperty(entryName, outputSchemaInfo?.data || null, entry.type),
      };
      if (requiredOutputs.has(entryName)) {
        outputs[entryName].required = true;
      }
    }
  }

  const documentationBody = extractAdditionalMarkdown(readmeMarkdown);

  const migrated = {
    schemaVersion: '2.0',
    id: legacy.id,
    version: legacy.version,
    kind: legacy.kind || 'component',
    summary: legacy.summary || '',
  };

  if (legacy.palette) {
    migrated.palette = legacy.palette;
  }
  if (legacy.hints) {
    migrated.hints = legacy.hints;
  }
  if (legacy.deps) {
    migrated.deps = legacy.deps;
  }
  if (legacy.implMatrix) {
    migrated.implMatrix = legacy.implMatrix;
  }
  if (legacy.ui) {
    migrated.ui = legacy.ui;
  }

  if (Object.keys(inputs).length > 0) {
    migrated.inputs = inputs;
  }
  if (Object.keys(outputs).length > 0) {
    migrated.outputs = outputs;
  }

  if (legacy.tool) {
    const tool = { ...legacy.tool };
    if (tool.inputSchema) {
      tool.inputSchema = tool.inputSchema;
    }
    if (tool.outputSchema) {
      tool.outputSchema = tool.outputSchema;
    }
    migrated.tool = tool;
  }

  if (documentationBody) {
    migrated.documentation = {
      body: documentationBody,
    };
  }

  const tomlContent = stringifyToml(migrated);
  await writeFile(filePath, tomlContent, 'utf8');

  // Ensure schema directory exists for future generated artefacts.
  if (migrated.tool?.inputSchema || migrated.tool?.outputSchema) {
    const schemaDir = path.join(dir, 'schema');
    if (!existsSync(schemaDir)) {
      await mkdir(schemaDir, { recursive: true });
    }
  }

  return true;
}

async function main() {
  const lcpFiles = [];
  for await (const file of walk(repoRoot)) {
    lcpFiles.push(file);
  }
  let migratedCount = 0;
  for (const file of lcpFiles) {
    const migrated = await migrateFile(file);
    if (migrated) {
      migratedCount += 1;
      const rel = path.relative(repoRoot, file);
      console.log(`Migrated ${rel}`);
    }
  }
  console.log(`Done. Migrated ${migratedCount} descriptor(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
