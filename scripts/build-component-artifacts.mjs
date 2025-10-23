#!/usr/bin/env node

/**
 * Generate component artefacts (README + JSON Schemas) from the canonical
 * `lcp.toml` descriptor (schemaVersion 2.0).
 *
 * This script parses each descriptor, validates the embedded JSON snippets,
 * synthesises input/output schemas and produces a deterministic README so
 * components only have to maintain a single TOML file.
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import TOML from '@iarna/toml';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const HEADER_LINE = `<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->`;

async function* walkComponents(root) {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    const base = path.basename(dir);
    if (['.git', 'node_modules', '.lcod', 'dist', 'target'].includes(base)) {
      continue;
    }
    let dirEntries;
    try {
      dirEntries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of dirEntries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile() && entry.name === 'lcp.toml') {
        yield entryPath;
      }
    }
  }
}

function ensureArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function parseJsonFragment(fragment, context) {
  if (typeof fragment !== 'string') return {};
  try {
    const parsed = JSON.parse(fragment);
    if (parsed && typeof parsed === 'object') return parsed;
    return parsed;
  } catch (err) {
    throw new Error(`${context}: invalid JSON fragment (${err.message})`);
  }
}

function describeSchema(fragment) {
  if (!fragment || typeof fragment !== 'object') return 'any';
  const schema = fragment;
  if (schema.title) return schema.title;
  if (Array.isArray(schema.enum)) {
    return `enum(${schema.enum.slice(0, 4).join(', ')}${schema.enum.length > 4 ? ', …' : ''})`;
  }
  if (schema.const !== undefined) {
    return `const ${JSON.stringify(schema.const)}`;
  }
  if (Array.isArray(schema.type)) {
    return schema.type.join(' | ');
  }
  if (schema.type) {
    if (schema.type === 'array' && schema.items && typeof schema.items === 'object') {
      const child = describeSchema(schema.items);
      return `array<${child}>`;
    }
    return schema.type;
  }
  return 'any';
}

function markdownTable(rows, headers) {
  if (!rows.length) return '';
  const headerLine = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  const lines = rows.map((cols) => `| ${cols.join(' | ')} |`);
  return [headerLine, separator, ...lines].join('\n');
}

function renderInputs(inputs) {
  if (!inputs || Object.keys(inputs).length === 0) return '';
  const rows = Object.entries(inputs).map(([name, spec]) => {
    const schema = parseJsonFragment(spec.schema, `inputs.${name}`);
    const type = describeSchema(schema);
    const required = spec.required ? 'Yes' : 'No';
    const description = spec.summary || '';
    return [`\`${name}\``, type, required, description];
  });
  const table = markdownTable(rows, ['Name', 'Type', 'Required', 'Description']);
  return `## Inputs\n\n${table}\n`;
}

function renderOutputs(outputs) {
  if (!outputs || Object.keys(outputs).length === 0) return '';
  const rows = Object.entries(outputs).map(([name, spec]) => {
    const schema = parseJsonFragment(spec.schema, `outputs.${name}`);
    const type = describeSchema(schema);
    const description = spec.summary || '';
    return [`\`${name}\``, type, description];
  });
  const table = markdownTable(rows, ['Name', 'Type', 'Description']);
  return `## Outputs\n\n${table}\n`;
}

function renderSlots(slots) {
  if (!slots || Object.keys(slots).length === 0) return '';
  const lines = ['## Slots', ''];
  for (const [name, spec] of Object.entries(slots)) {
    lines.push(`### ${name}`);
    if (spec.summary) lines.push(spec.summary);
    if (spec.description) {
      lines.push('');
      lines.push(spec.description);
    }
    if (spec.schema) {
      lines.push('');
      lines.push('```json');
      lines.push(spec.schema.trim());
      lines.push('```');
    }
    if (spec.example) {
      lines.push('');
      lines.push('```yaml');
      lines.push(spec.example.trim());
      lines.push('```');
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}

function encodeIconId(iconId) {
  if (typeof iconId !== 'string') return '';
  const trimmed = iconId.trim();
  if (!trimmed) return '';
  return trimmed
    .split(':')
    .map((part) => encodeURIComponent(part.trim()))
    .join(':');
}

function buildIconMarkup(descriptor, size = 48) {
  const iconId = descriptor?.palette?.icon;
  if (typeof iconId !== 'string' || !iconId.trim()) return '';
  const encoded = encodeIconId(iconId);
  if (!encoded) return '';
  const altSource = descriptor.summary || descriptor.id || 'Component icon';
  const alt = String(altSource).replace(/"/g, '&quot;');
  return `<p><img src="https://api.iconify.design/${encoded}.svg?height=${size}&width=${size}" alt="${alt}" width="${size}" height="${size}" /></p>`;
}

function buildObjectSchema(entries, options = {}) {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    additionalProperties: false,
    properties: {},
  };
  const required = [];
  for (const [name, spec] of Object.entries(entries || {})) {
    const fragment = parseJsonFragment(spec.schema, `${options.section || 'inputs'}.${name}`);
    const property = { ...fragment };
    if (!property.description && spec.summary) {
      property.description = spec.summary;
    }
    if (spec.examples && Array.isArray(spec.examples) && spec.examples.length) {
      property.examples = spec.examples.map((entry) => {
        try {
          return JSON.parse(entry);
        } catch {
          return entry;
        }
      });
    } else if (spec.example) {
      try {
        property.examples = [JSON.parse(spec.example)];
      } catch {
        property.examples = [spec.example];
      }
    }
    if (spec.default) {
      try {
        property.default = JSON.parse(spec.default);
      } catch {
        property.default = spec.default;
      }
    }
    schema.properties[name] = property;
    if (spec.required) required.push(name);
  }
  if (required.length) schema.required = required;
  if (options.description) schema.description = options.description;
  return schema;
}

async function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

function normaliseLineEndings(text) {
  return text.replace(/\r\n/g, '\n');
}

async function generateForComponent(lcpPath) {
  const dir = path.dirname(lcpPath);
  const rel = path.relative(repoRoot, lcpPath);
  const tomlContent = await readFile(lcpPath, 'utf8');
  const descriptor = TOML.parse(tomlContent);
  if (descriptor.schemaVersion !== '2.0') {
    throw new Error(`Unsupported schemaVersion in ${rel}: ${descriptor.schemaVersion}`);
  }

  const readmeSections = [HEADER_LINE];
  const iconMarkup = buildIconMarkup(descriptor);
  if (iconMarkup) {
    readmeSections.push(iconMarkup, '');
  }
  readmeSections.push(`# ${descriptor.id}`, '');
  if (descriptor.summary) {
    readmeSections.push(descriptor.summary, '');
  }

  const inputsSection = renderInputs(descriptor.inputs);
  if (inputsSection) {
    readmeSections.push(inputsSection.trimEnd(), '');
  }
  const outputsSection = renderOutputs(descriptor.outputs);
  if (outputsSection) {
    readmeSections.push(outputsSection.trimEnd(), '');
  }
  const slotsSection = renderSlots(descriptor.slots);
  if (slotsSection) {
    readmeSections.push(slotsSection.trimEnd(), '');
  }

  if (descriptor.documentation?.body) {
    readmeSections.push('## Notes', '');
    readmeSections.push(descriptor.documentation.body.trim(), '');
  }

  const readmeContent = normaliseLineEndings(readmeSections.join('\n').trimEnd() + '\n');
  const readmePath = path.join(dir, 'README.md');
  await writeFile(readmePath, readmeContent, 'utf8');

  if (descriptor.inputs && Object.keys(descriptor.inputs).length) {
    const inputSchema = buildObjectSchema(descriptor.inputs, {
      section: 'inputs',
      description: descriptor.summary || '',
    });
    if (descriptor.tool?.inputSchema) {
      const inputSchemaPath = path.join(dir, descriptor.tool.inputSchema);
      await ensureDirForFile(inputSchemaPath);
      await writeFile(inputSchemaPath, JSON.stringify(inputSchema, null, 2), 'utf8');
    }
  }

  if (descriptor.outputs && Object.keys(descriptor.outputs).length) {
    const outputSchema = buildObjectSchema(descriptor.outputs, {
      section: 'outputs',
      description: descriptor.summary || '',
    });
    if (descriptor.tool?.outputSchema) {
      const outputSchemaPath = path.join(dir, descriptor.tool.outputSchema);
      await ensureDirForFile(outputSchemaPath);
      await writeFile(outputSchemaPath, JSON.stringify(outputSchema, null, 2), 'utf8');
    }
  }
}

async function main() {
  const lcpFiles = [];
  for await (const file of walkComponents(repoRoot)) {
    lcpFiles.push(file);
  }
  let processed = 0;
  for (const file of lcpFiles) {
    try {
      await generateForComponent(file);
      processed += 1;
    } catch (err) {
      console.error(`ERROR: Failed to build artefacts for ${path.relative(repoRoot, file)}: ${err.message}`);
      process.exitCode = 1;
    }
  }
  console.log(`Generated artefacts for ${processed} component(s).`);
  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
