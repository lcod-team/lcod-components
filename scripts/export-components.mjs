#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import toml from '@iarna/toml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function main() {
  const componentsRoot = path.join(repoRoot, 'packages', 'std');
  const manifestPath = path.join(componentsRoot, 'lcp.toml');
  const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
  const manifest = toml.parse(manifestRaw);
  const entries = Array.isArray(manifest?.workspace?.components)
    ? manifest.workspace.components
    : [];
  const components = entries
    .filter((entry) => entry && typeof entry === 'object' && typeof entry.id === 'string' && typeof entry.path === 'string')
    .map((entry) => {
      const composeRel = path.join(entry.path, 'compose.yaml');
      return {
        id: entry.id,
        composePath: composeRel
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const outputPath = path.join(repoRoot, 'registry', 'components.std.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(components, null, 2) + '\n', 'utf-8');
  console.log(`Exported ${components.length} components to ${path.relative(repoRoot, outputPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
