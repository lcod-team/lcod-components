#!/usr/bin/env node
import { createWriteStream } from 'node:fs';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { parse as parseToml } from '@iarna/toml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const execFileAsync = promisify(execFile);

const RELEASE_OWNER = 'lcod-team';
const RELEASE_REPO = 'lcod-release';
const RUNTIME_ASSET_PREFIX = 'lcod-kernel-js-runtime-';

function usage() {
  console.log(`Usage: node scripts/check-runtime-overlap.mjs [--runtime <path>]

Ensures that components listed in registry/components.std.jsonl are not present
in the runtime manifest. If no runtime manifest is provided, the script attempts
to reuse ../lcod-spec/dist/runtime or downloads the latest published runtime
bundle from lcod-release.

Options:
  --runtime <path>   Path to runtime manifest (JSON/JSONL) or runtime directory.
  -h, --help         Show this help message.
`);
}

function parseArgs(argv) {
  const opts = { runtime: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--runtime':
        opts.runtime = argv[++i];
        break;
      case '-h':
      case '--help':
        usage();
        process.exit(0);
      default:
        if (arg.startsWith('--runtime=')) {
          opts.runtime = arg.split('=', 2)[1];
        } else {
          console.error(`[ERROR] Unknown argument: ${arg}`);
          usage();
          process.exit(1);
        }
    }
  }
  return opts;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function parseJsonl(content) {
  return content
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`Invalid JSONL line ${index + 1}: ${err.message}`);
      }
    });
}

async function loadComponentIdsFromJsonl(manifestPath) {
  const raw = await fs.readFile(manifestPath, 'utf-8');
  return parseJsonl(raw)
    .filter((entry) => entry.type === 'component' && typeof entry.id === 'string')
    .map((entry) => entry.id);
}

async function loadComponentIdsFromJson(manifestPath) {
  const raw = await fs.readFile(manifestPath, 'utf-8');
  const data = JSON.parse(raw);

  const components = Array.isArray(data?.components)
    ? data.components
    : Array.isArray(data?.entries)
      ? data.entries
      : null;

  if (!components) {
    throw new Error('Unable to locate component list in JSON manifest.');
  }

  return components
    .map((entry) => entry?.id)
    .filter((id) => typeof id === 'string');
}

async function collectComponentIdsFromRuntimeTree(runtimeRoot) {
  const ids = new Set();
  const stack = [runtimeRoot];

  while (stack.length > 0) {
    const current = stack.pop();
    const children = await fs.readdir(current, { withFileTypes: true });
    for (const child of children) {
      const childPath = path.join(current, child.name);
      if (child.isDirectory()) {
        stack.push(childPath);
      } else if (child.isFile() && child.name === 'lcp.toml') {
        try {
          const raw = await fs.readFile(childPath, 'utf-8');
          const parsed = parseToml(raw);
          if (parsed?.kind === 'component' && typeof parsed?.id === 'string') {
            ids.add(parsed.id);
          }
        } catch (err) {
          console.warn(`[warn] Failed to parse ${childPath}: ${err instanceof Error ? err.message : err}`);
        }
      }
    }
  }

  return Array.from(ids);
}

async function resolveLocalRuntimeComponentIds() {
  const candidates = [
    path.resolve(repoRoot, '..', 'lcod-spec', 'dist', 'runtime'),
    path.resolve(repoRoot, '..', '..', 'lcod-spec', 'dist', 'runtime'),
  ];

  for (const base of candidates) {
    try {
      const entries = await fs.readdir(base, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || !entry.name.startsWith('lcod-runtime-')) {
          continue;
        }
        const runtimeDir = path.join(base, entry.name);
        const manifestJsonl = path.join(runtimeDir, 'manifest.jsonl');
        if (await fileExists(manifestJsonl)) {
          return { ids: await loadComponentIdsFromJsonl(manifestJsonl), cleanup: null };
        }
        const manifestJson = path.join(runtimeDir, 'manifest.json');
        if (await fileExists(manifestJson)) {
          try {
            const ids = await loadComponentIdsFromJson(manifestJson);
            if (ids.length > 0) {
              return { ids, cleanup: null };
            }
          } catch {
            // ignore parsing error and fallback to traversal
          }
          return { ids: await collectComponentIdsFromRuntimeTree(runtimeDir), cleanup: null };
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

async function downloadReleaseMetadata(versionOverride) {
  const headers = {
    'User-Agent': 'lcod-components-runtime-check',
    Accept: 'application/vnd.github+json',
  };
  const token = process.env.GITHUB_TOKEN ?? process.env.LCOD_GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const versionTag = versionOverride
    ? versionOverride.startsWith('v')
      ? versionOverride
      : `v${versionOverride}`
    : null;
  const endpoint = versionTag
    ? `https://api.github.com/repos/${RELEASE_OWNER}/${RELEASE_REPO}/releases/tags/${versionTag}`
    : `https://api.github.com/repos/${RELEASE_OWNER}/${RELEASE_REPO}/releases/latest`;

  const response = await fetch(endpoint, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch release metadata (${response.status}): ${response.statusText}`);
  }

  const metadata = await response.json();
  const tag = metadata?.tag_name;
  const assets = Array.isArray(metadata?.assets) ? metadata.assets : [];

  const runtimeAsset = assets.find(
    (asset) => asset?.name?.startsWith(RUNTIME_ASSET_PREFIX) && asset?.name?.endsWith('.tar.gz'),
  );
  if (!runtimeAsset) {
    throw new Error(`Runtime asset not found in release ${tag ?? versionTag ?? 'latest'}.`);
  }

  const versionMatch = runtimeAsset.name.match(/lcod-kernel-js-runtime-(.+)\.tar\.gz/);
  const assetVersion = versionMatch ? versionMatch[1] : null;

  return {
    tag,
    asset: {
      name: runtimeAsset.name,
      url: runtimeAsset.browser_download_url,
    },
    version: assetVersion,
  };
}

async function downloadFile(url, destination) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'lcod-components-runtime-check',
      Accept: 'application/octet-stream',
    },
  });
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }

  const stream = Readable.fromWeb(response.body);
  await pipeline(stream, createWriteStream(destination));
}

async function loadComponentIdsFromRuntimeRoot(runtimeRoot) {
  const manifestJsonl = path.join(runtimeRoot, 'manifest.jsonl');
  if (await fileExists(manifestJsonl)) {
    return loadComponentIdsFromJsonl(manifestJsonl);
  }

  const manifestJson = path.join(runtimeRoot, 'manifest.json');
  if (await fileExists(manifestJson)) {
    try {
      const ids = await loadComponentIdsFromJson(manifestJson);
      if (ids.length > 0) {
        return ids;
      }
    } catch {
      // fall through to filesystem traversal
    }
  }

  return collectComponentIdsFromRuntimeTree(runtimeRoot);
}

async function loadRuntimeComponentIdsFromArchive(versionOverride) {
  const releaseInfo = await downloadReleaseMetadata(versionOverride);
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'lcod-runtime-'));
  const archivePath = path.join(tmpRoot, releaseInfo.asset.name);

  try {
    await downloadFile(releaseInfo.asset.url, archivePath);
    await execFileAsync('tar', ['-xzf', archivePath, '-C', tmpRoot]);

    const extracted = await fs.readdir(tmpRoot, { withFileTypes: true });
    const runtimeDirEntry = extracted.find(
      (entry) => entry.isDirectory() && entry.name.startsWith('lcod-runtime-'),
    );
    if (!runtimeDirEntry) {
      throw new Error('Unable to locate runtime root inside downloaded archive.');
    }

    const runtimeRoot = path.join(tmpRoot, runtimeDirEntry.name);
    const ids = await loadComponentIdsFromRuntimeRoot(runtimeRoot);
    return {
      ids,
      cleanup: async () => {
        await fs.rm(tmpRoot, { recursive: true, force: true });
      },
      source: `downloaded runtime ${releaseInfo.version ?? releaseInfo.tag ?? 'latest'}`,
    };
  } catch (err) {
    await fs.rm(tmpRoot, { recursive: true, force: true });
    throw err;
  }
}

async function loadRuntimeComponentIds(runtimeOption) {
  if (runtimeOption) {
    const resolved = path.resolve(runtimeOption);
    let stats;
    try {
      stats = await fs.stat(resolved);
    } catch {
      throw new Error(`Runtime path "${runtimeOption}" does not exist.`);
    }

    if (stats.isDirectory()) {
      const ids = await loadComponentIdsFromRuntimeRoot(resolved);
      return { ids, cleanup: null, source: resolved };
    }

    if (stats.isFile()) {
      const ext = path.extname(resolved).toLowerCase();
      if (ext === '.jsonl') {
        return { ids: await loadComponentIdsFromJsonl(resolved), cleanup: null, source: resolved };
      }
      if (ext === '.json') {
        try {
          const ids = await loadComponentIdsFromJson(resolved);
          if (ids.length > 0) {
            return { ids, cleanup: null, source: resolved };
          }
        } catch {
          // ignore and attempt traversal using containing directory
        }
        const runtimeRoot = path.dirname(resolved);
        const ids = await collectComponentIdsFromRuntimeTree(runtimeRoot);
        return { ids, cleanup: null, source: runtimeRoot };
      }
    }

    throw new Error(`Unsupported runtime manifest path: ${runtimeOption}`);
  }

  const local = await resolveLocalRuntimeComponentIds();
  if (local) {
    return { ...local, source: 'local spec runtime' };
  }

  const versionOverride = process.env.LCOD_RUNTIME_VERSION ?? null;
  return loadRuntimeComponentIdsFromArchive(versionOverride);
}

async function loadRegistryComponentIds() {
  const registryManifest = path.join(repoRoot, 'registry', 'components.std.jsonl');
  return loadComponentIdsFromJsonl(registryManifest);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let runtimeCleanup = null;
  let runtimeSource = null;
  try {
    const [{ ids: runtimeIds, cleanup, source }, registryIds] = await Promise.all([
      loadRuntimeComponentIds(args.runtime),
      loadRegistryComponentIds(),
    ]);

    runtimeCleanup = cleanup;
    runtimeSource = source;

    const runtimeIdSet = new Set(runtimeIds);
    const duplicates = registryIds.filter((id) => runtimeIdSet.has(id));

    if (duplicates.length > 0) {
      console.error('[ERROR] Found components duplicated between runtime and lcod-components registry:');
      for (const id of duplicates) {
        console.error(` - ${id}`);
      }
      process.exit(1);
    }

    const suffix = runtimeSource ? ` (runtime source: ${runtimeSource})` : '';
    console.log(`No runtime duplicates detected. Registry components are runtime-exclusive.${suffix}`);
  } finally {
    if (runtimeCleanup) {
      await runtimeCleanup();
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
