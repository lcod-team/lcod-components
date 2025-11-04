#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import toml from '@iarna/toml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function listComponentsFromDir(packageRoot, componentsDir) {
  const absoluteDir = path.resolve(packageRoot, componentsDir);
  const entries = [];

  async function walk(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      if (dirent.name.startsWith('.')) continue;
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        await walk(fullPath);
      } else if (dirent.isFile() && dirent.name === 'lcp.toml') {
        const descriptorRaw = await fs.readFile(fullPath, 'utf-8');
        const descriptor = toml.parse(descriptorRaw);
        const componentId = descriptor?.id;
        if (typeof componentId !== 'string' || !componentId) {
          continue;
        }
        const componentDir = path.dirname(fullPath);
        const relDir = path.relative(packageRoot, componentDir);
        const composeRel = path.join(relDir, 'compose.yaml').replace(/\\/g, '/');
        const lcpRel = path.join(relDir, 'lcp.toml').replace(/\\/g, '/');
        entries.push({
          id: componentId,
          composePath: path.posix.join('packages/std', composeRel),
          lcpPath: path.posix.join('packages/std', lcpRel)
        });
      }
    }
  }

  await walk(absoluteDir);
  return entries;
}

async function main() {
  const packageRoot = path.join(repoRoot, 'packages', 'std');
  const manifestPath = path.join(packageRoot, 'lcp.toml');
  const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
  const manifest = toml.parse(manifestRaw);
  const workspace = manifest?.workspace ?? {};

  let entries = [];
  if (Array.isArray(workspace.components) && workspace.components.length > 0) {
    entries = workspace.components
      .filter((entry) => entry && typeof entry.id === 'string' && typeof entry.path === 'string')
      .map((entry) => {
        const composeRel = path.join(entry.path, 'compose.yaml').replace(/\\/g, '/');
        const lcpRel = path.join(entry.path, 'lcp.toml').replace(/\\/g, '/');
        return {
          id: entry.id,
          composePath: path.posix.join('packages/std', composeRel),
          lcpPath: path.posix.join('packages/std', lcpRel)
        };
      });
  } else if (typeof workspace.componentsDir === 'string' && workspace.componentsDir.trim()) {
    entries = await listComponentsFromDir(packageRoot, workspace.componentsDir.trim());
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));

  const outputDir = path.join(repoRoot, 'registry');
  await fs.mkdir(outputDir, { recursive: true });
  const jsonlPath = path.join(outputDir, 'components.std.jsonl');
  const manifestId = 'lcod-components/std';
  const manifestVersion = typeof manifest.version === 'string' ? manifest.version : undefined;
  const description = 'Standard LCOD tooling components exported from lcod-components.';

  const header = {
    type: 'manifest',
    schema: 'lcod-manifest/list@1',
    id: manifestId,
    description,
    package: manifestId,
    version: manifestVersion
  };

  const jsonlLines = [
    JSON.stringify(header),
    ...entries.map(({ id, composePath, lcpPath }) =>
      JSON.stringify({
        type: 'component',
        id,
        compose: composePath,
        lcp: lcpPath,
        package: manifestId,
        version: manifestVersion
      })
    )
  ];

  await fs.writeFile(jsonlPath, `${jsonlLines.join('\n')}\n`, 'utf-8');
  console.log(`Exported JSONL manifest with ${entries.length} component(s) to ${path.relative(repoRoot, jsonlPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
