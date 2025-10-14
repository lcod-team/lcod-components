import { promises as fs } from 'fs';
import path from 'path';
import toml from '@iarna/toml';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const packagesRoot = path.join(repoRoot, 'packages');

const requiredPaletteKeys = ['category', 'icon', 'tags'];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function collectComponentDirs(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const dirs = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const full = path.join(root, entry.name);
    const lcpPath = path.join(full, 'lcp.toml');
    const composePath = path.join(full, 'compose.yaml');
    const hasLcp = await exists(lcpPath);
    const hasCompose = await exists(composePath);
    if (hasLcp && hasCompose) {
      dirs.push(full);
    } else {
      const nested = await collectComponentDirs(full);
      dirs.push(...nested);
    }
  }
  return dirs;
}

function requireString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

async function verifyComponent(dir, errors) {
  const rel = path.relative(repoRoot, dir);
  const lcpPath = path.join(dir, 'lcp.toml');
  let descriptor;
  try {
    const raw = await fs.readFile(lcpPath, 'utf8');
    descriptor = toml.parse(raw);
  } catch (err) {
    errors.push(`${rel}: failed to parse lcp.toml (${err.message})`);
    return;
  }

  if (!requireString(descriptor.summary)) {
    errors.push(`${rel}: missing or empty summary`);
  }

  const palette = descriptor.palette;
  if (!palette || typeof palette !== 'object') {
    errors.push(`${rel}: missing [palette] section`);
  } else {
    for (const key of requiredPaletteKeys) {
      if (key === 'tags') {
        if (!Array.isArray(palette.tags) || palette.tags.length === 0) {
          errors.push(`${rel}: palette.tags must be a non-empty array`);
        }
      } else if (!requireString(palette[key])) {
        errors.push(`${rel}: palette.${key} must be set`);
      }
    }
  }

  const docs = descriptor.docs;
  if (!docs || !requireString(docs.readme)) {
    errors.push(`${rel}: docs.readme must reference README.md`);
  } else {
    const readmePath = path.join(dir, docs.readme);
    if (!await exists(readmePath)) {
      errors.push(`${rel}: README.md not found (${docs.readme})`);
    } else {
      const content = await fs.readFile(readmePath, 'utf8');
      if (!requireString(content)) {
        errors.push(`${rel}: README.md is empty`);
      }
    }
  }

  const io = descriptor.io || {};
  const inputs = Array.isArray(io.input) ? io.input : [];
  const outputs = Array.isArray(io.output) ? io.output : [];
  if (inputs.length === 0 && outputs.length === 0) {
    errors.push(`${rel}: missing [[io.input]] / [[io.output]] definitions`);
  }
}

async function main() {
  const componentsDirs = await collectComponentDirs(packagesRoot);
  const errors = [];
  for (const dir of componentsDirs) {
    await verifyComponent(dir, errors);
  }

  if (errors.length) {
    console.error('Component verification failed:');
    for (const err of errors) {
      console.error(` - ${err}`);
    }
    process.exit(1);
  } else {
    console.log(`Verified ${componentsDirs.length} component(s).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
