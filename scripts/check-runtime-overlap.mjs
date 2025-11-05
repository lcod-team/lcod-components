#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

function usage() {
  console.log(`Usage: node scripts/check-runtime-overlap.mjs [--runtime <manifest.jsonl>]

Ensures that components listed in registry/components.std.jsonl are not present
in the runtime manifest (manifest.jsonl).

Options:
  --runtime <path>   Path to runtime manifest.jsonl (defaults to ../lcod-spec/dist/runtime/... if available)
  -h, --help         Show this help message
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

async function resolveDefaultRuntimePath() {
  const candidates = [
    path.resolve(repoRoot, '..', 'lcod-spec', 'dist', 'runtime'),
    path.resolve(repoRoot, '..', '..', 'lcod-spec', 'dist', 'runtime'),
  ];

  for (const base of candidates) {
    try {
      const entries = await fs.readdir(base);
      const manifestDir = entries.find((entry) => entry.startsWith('lcod-runtime-'));
      if (!manifestDir) continue;
      const manifestPath = path.join(base, manifestDir, 'manifest.jsonl');
      await fs.access(manifestPath);
      return manifestPath;
    } catch (err) {
      continue;
    }
  }
  return null;
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

async function readManifestEntries(manifestPath) {
  const raw = await fs.readFile(manifestPath, 'utf-8');
  return parseJsonl(raw).filter((entry) => entry.type === 'component');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let runtimeManifest = args.runtime;
  if (!runtimeManifest) {
    runtimeManifest = await resolveDefaultRuntimePath();
    if (!runtimeManifest) {
      console.error('[ERROR] Unable to locate runtime manifest. Use --runtime <path>.');
      process.exit(1);
    }
  }
  const resolvedRuntime = path.resolve(runtimeManifest);
  const registryManifest = path.join(repoRoot, 'registry', 'components.std.jsonl');

  const [runtimeEntries, registryEntries] = await Promise.all([
    readManifestEntries(resolvedRuntime),
    readManifestEntries(registryManifest),
  ]);

  const runtimeIds = new Set(runtimeEntries.map((entry) => entry.id));
  const duplicates = registryEntries.filter((entry) => runtimeIds.has(entry.id));

  if (duplicates.length > 0) {
    console.error('[ERROR] Found components duplicated between runtime and lcod-components registry:');
    for (const entry of duplicates) {
      console.error(` - ${entry.id}`);
    }
    process.exit(1);
  }

  console.log('No runtime duplicates detected. Registry components are runtime-exclusive.');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
