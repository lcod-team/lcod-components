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
        const relDir = path.relative(repoRoot, componentDir);
        const composeRel = path.join(relDir, 'compose.yaml').replace(/\\/g, '/');
        const lcpRel = path.join(relDir, 'lcp.toml').replace(/\\/g, '/');
        entries.push({
          id: componentId,
          composePath: composeRel,
          lcpPath: lcpRel
        });
      }
    }
  }

  await walk(absoluteDir);
  return entries;
}

function listComponentsFromInline(packageRoot, entries) {
  return entries
    .filter((entry) => entry && typeof entry.id === 'string' && typeof entry.path === 'string')
    .map((entry) => {
      const componentDir = path.resolve(packageRoot, entry.path);
      const relDir = path.relative(repoRoot, componentDir);
      const composeRel = path.join(relDir, 'compose.yaml').replace(/\\/g, '/');
      const lcpRel = path.join(relDir, 'lcp.toml').replace(/\\/g, '/');
      return {
        id: entry.id,
        composePath: composeRel,
        lcpPath: lcpRel
      };
    });
}

async function collectPackageEntries(packageName) {
  const packageRoot = path.join(repoRoot, 'packages', packageName);
  const manifestPath = path.join(packageRoot, 'lcp.toml');
  try {
    const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
    const manifest = toml.parse(manifestRaw);
    const workspace = manifest?.workspace ?? {};

    if (Array.isArray(workspace.components) && workspace.components.length > 0) {
      return listComponentsFromInline(packageRoot, workspace.components);
    }
    if (typeof workspace.componentsDir === 'string' && workspace.componentsDir.trim()) {
      return listComponentsFromDir(packageRoot, workspace.componentsDir.trim());
    }
  } catch (err) {
    console.warn(`Unable to read package manifest for ${packageName}: ${err.message || err}`);
  }
  return [];
}

async function main() {
  const workspaceManifestPath = path.join(repoRoot, 'workspace.lcp.toml');
  let workspaceManifest = {};
  try {
    const raw = await fs.readFile(workspaceManifestPath, 'utf-8');
    workspaceManifest = toml.parse(raw);
  } catch (err) {
    console.warn(`Unable to load workspace manifest: ${err.message || err}`);
  }

  const packages = Array.isArray(workspaceManifest.workspace?.packages)
    ? workspaceManifest.workspace.packages
    : ['std'];

  let entries = [];
  for (const packageName of packages) {
    const packageEntries = await collectPackageEntries(packageName);
    entries = entries.concat(packageEntries);
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));

  const outputDir = path.join(repoRoot, 'registry');
  await fs.mkdir(outputDir, { recursive: true });
  const jsonlPath = path.join(outputDir, 'components.std.jsonl');
  const manifestId = 'lcod-components/std';
  const manifestVersion = typeof workspaceManifest.version === 'string'
    ? workspaceManifest.version
    : undefined;
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
