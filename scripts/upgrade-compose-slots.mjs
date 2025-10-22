#!/usr/bin/env node

/**
 * Duplicate legacy `children` slot declarations under the new `slots` key.
 * This keeps existing kernels working (they still read `children`) while the
 * specification migrates to the terminology we actually use in documentation.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { readdir } from 'node:fs/promises';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

async function* walkCompose(root) {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    const base = path.basename(dir);
    if (['.git', 'node_modules', '.lcod', 'dist', 'target'].includes(base)) {
      continue;
    }
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name === 'compose.yaml') {
        yield full;
      }
    }
  }
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function upgradeSlots(node) {
  let changed = false;
  if (Array.isArray(node)) {
    for (const item of node) {
      if (upgradeSlots(item)) changed = true;
    }
    return changed;
  }
  if (node && typeof node === 'object') {
    if (Object.prototype.hasOwnProperty.call(node, 'children')) {
      if (!Object.prototype.hasOwnProperty.call(node, 'slots')) {
        node.slots = deepClone(node.children);
        changed = true;
      }
    }
    for (const value of Object.values(node)) {
      if (upgradeSlots(value)) changed = true;
    }
    return changed;
  }
  return changed;
}

async function processCompose(filePath) {
  const rel = path.relative(repoRoot, filePath);
  const text = await readFile(filePath, 'utf8');
  const data = YAML.parse(text);
  const changed = upgradeSlots(data);
  if (changed) {
    const next = YAML.stringify(data, { lineWidth: 0 });
    await writeFile(filePath, next, 'utf8');
    console.log(`Updated slots in ${rel}`);
  }
  return changed;
}

async function main() {
  let total = 0;
  for await (const file of walkCompose(repoRoot)) {
    const changed = await processCompose(file);
    if (changed) total += 1;
  }
  console.log(`Slots upgraded in ${total} compose file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
