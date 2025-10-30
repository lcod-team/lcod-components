#!/usr/bin/env node

/**
 * Execute the lcod-components test suites against release kernels (Rust + Java).
 *
 * The script downloads the latest release manifest from lcod-release,
 * fetches the appropriate artefacts for each kernel, and runs the YAML/JSON
 * fixtures using the toolrunner binaries.
 */

import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { performance } from 'perf_hooks';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const defaultProjectPath = path.join(repoRoot, 'packages', 'std');
const USER_AGENT = 'lcod-components-test-runner/1.0';
let cachedSpecRoot = null;
let cachedComponentsRoot = null;

async function main() {
  const { kernels, versionOverride } = parseArgs(process.argv.slice(2));
  const manifest = await fetchReleaseManifest(versionOverride);
  console.log(`Using LCOD release ${manifest.version}`);

  cachedSpecRoot = await resolveSpecRoot();
  if (cachedSpecRoot && !process.env.SPEC_REPO_PATH) {
    process.env.SPEC_REPO_PATH = cachedSpecRoot;
  }
  cachedComponentsRoot = await resolveComponentsRoot();
  if (cachedComponentsRoot && !process.env.LCOD_COMPONENTS_PATH) {
    process.env.LCOD_COMPONENTS_PATH = cachedComponentsRoot;
  }

  const composeTests = [
    {
      label: 'components.registry',
      file: path.join(repoRoot, 'tests', 'components.registry.yaml'),
      needsProjectPath: true,
      check: null,
      requires: ['registry-components'],
    },
    {
      label: 'components.registry.tests',
      file: path.join(repoRoot, 'tests', 'components.registry.tests.yaml'),
      needsProjectPath: true,
      check: ensureTestCheckerSuccess,
      requires: ['registry-components'],
    },
    {
      label: 'components.std_primitives',
      file: path.join(repoRoot, 'tests', 'components.std_primitives.yaml'),
      needsProjectPath: false,
      check: ensureTestCheckerSuccess,
    },
    {
      label: 'components.verify.metadata',
      file: path.join(repoRoot, 'tests', 'components.verify.metadata.yaml'),
      needsProjectPath: true,
      check: null,
      requires: ['toml-parse'],
    },
  ];

  const jsonSuites = await collectJsonSuites();

  const failures = [];
  const results = [];

  for (const kernelId of kernels) {
    const kernelInfo = manifest.kernels[kernelId];
    if (!kernelInfo) {
      throw new Error(`Release manifest does not contain information for kernel '${kernelId}'`);
    }
    console.log(`\n=== Running tests with kernel '${kernelId}' ===`);
    const binaryPath = await ensureKernelBinary(kernelId, manifest.version, kernelInfo);
    await prepareWorkspaces();

    const env = {
      ...process.env,
      LCOD_CACHE_DIR: path.join(repoRoot, '.lcod', 'cache', kernelId),
    };
    if (cachedSpecRoot && !env.SPEC_REPO_PATH) {
      env.SPEC_REPO_PATH = cachedSpecRoot;
    }
    if (cachedComponentsRoot && !env.LCOD_COMPONENTS_PATH) {
      env.LCOD_COMPONENTS_PATH = cachedComponentsRoot;
    }
    await fs.mkdir(env.LCOD_CACHE_DIR, { recursive: true });

    const capabilities = await detectCapabilities(kernelId, binaryPath, env);
    if (capabilities.size > 0) {
      console.log(`  capabilities: ${Array.from(capabilities).join(', ')}`);
    } else {
      console.log('  capabilities: none detected');
    }

    for (const test of composeTests) {
      try {
        const missing = missingCapabilities(test.requires, capabilities);
        if (missing.length > 0) {
          console.log(`  - ${test.label} (skipped: missing ${missing.join(', ')})`);
          results.push({ kernel: kernelId, label: test.label, status: 'skip', durationMs: 0 });
          continue;
        }
        const inputState = test.needsProjectPath
          ? { projectPath: defaultProjectPath }
          : undefined;
        const { output, durationMs } = await runCompose(binaryPath, test.file, {
          input: inputState,
          env,
          check: test.check,
        });
        results.push({ kernel: kernelId, label: test.label, status: 'pass', durationMs });
        console.log(`  ✓ ${test.label}`);
      } catch (err) {
        const durationMs = err.durationMs ?? null;
        results.push({ kernel: kernelId, label: test.label, status: 'fail', durationMs });
        failures.push({ kernel: kernelId, test: test.label, error: err });
        console.error(`  ✗ ${test.label} (${err.message})`);
      }
    }

    for (const suite of jsonSuites) {
      for (const testCase of suite.tests) {
        const label = `${suite.id} :: ${testCase.name}`;
        try {
          const suiteRequirements = determineJsonRequirements(suite.id, testCase);
          const missing = missingCapabilities(suiteRequirements, capabilities);
          if (missing.length > 0) {
            console.log(`  - ${label} (skipped: missing ${missing.join(', ')})`);
            results.push({ kernel: kernelId, label, status: 'skip', durationMs: 0 });
            continue;
          }
          const composePath = await writeJsonCompose(suite.dir, testCase);
          const { output, durationMs } = await runCompose(binaryPath, composePath, {
            input: { projectPath: defaultProjectPath },
            env,
            check: ensureTestCheckerSuccess,
          });
          await fs.unlink(composePath).catch(() => {});
          results.push({ kernel: kernelId, label, status: 'pass', durationMs });
          console.log(`  ✓ ${label}`);
        } catch (err) {
          const durationMs = err.durationMs ?? null;
          results.push({ kernel: kernelId, label, status: 'fail', durationMs });
          failures.push({ kernel: kernelId, test: label, error: err });
          console.error(`  ✗ ${label} (${err.message})`);
        }
      }
    }
  }

  printResultMatrix(results, kernels);

  if (failures.length > 0) {
    console.error('\nTest failures detected:');
    for (const failure of failures) {
      console.error(`- [${failure.kernel}] ${failure.test}: ${failure.error.stack || failure.error.message}`);
    }
    process.exit(1);
  }
}

function parseArgs(args) {
  const kernels = [];
  let version = process.env.LCOD_RELEASE_VERSION ?? null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--kernel' || arg === '-k') {
      if (i + 1 >= args.length) {
        throw new Error('--kernel requires a value');
      }
      kernels.push(args[i + 1]);
      i += 1;
    } else if (arg.startsWith('--kernel=')) {
      kernels.push(arg.split('=')[1]);
    } else if (arg === '--version' || arg === '-v') {
      if (i + 1 >= args.length) {
        throw new Error('--version requires a value');
      }
      version = args[i + 1];
      i += 1;
    } else if (arg.startsWith('--version=')) {
      version = arg.split('=')[1];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (kernels.length === 0) {
    kernels.push('rs', 'java');
  }
  return { kernels, versionOverride: version };
}

async function fetchReleaseManifest(versionOverride) {
  if (versionOverride) {
    const tag = versionOverride.startsWith('v') ? versionOverride : `v${versionOverride}`;
    const url = `https://github.com/lcod-team/lcod-release/releases/download/${tag}/release-manifest.json`;
    const response = await fetchJson(url);
    response.version = versionOverride.startsWith('v') ? versionOverride.slice(1) : versionOverride;
    return response;
  }

  const latest = await fetchJson('https://api.github.com/repos/lcod-team/lcod-release/releases/latest');
  const manifestAsset = Array.isArray(latest.assets)
    ? latest.assets.find((asset) => asset?.name === 'release-manifest.json')
    : null;
  if (!manifestAsset || !manifestAsset.browser_download_url) {
    throw new Error('Unable to locate release-manifest.json in latest lcod-release assets');
  }
  const manifest = await fetchJson(manifestAsset.browser_download_url);
  if (typeof manifest.version !== 'string' || manifest.version.length === 0) {
    manifest.version = latest.tag_name?.replace(/^v/, '') ?? 'unknown';
  }
  return manifest;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  return res.json();
}

async function ensureKernelBinary(kernelId, version, kernelInfo) {
  const targetDir = path.join(repoRoot, '.lcod', 'kernels', kernelId, version);
  let binaryPath;
  if (kernelId === 'rs') {
    binaryPath = path.join(targetDir, 'lcod-run');
  } else if (kernelId === 'java') {
    binaryPath = path.join(targetDir, 'bin', 'lcod-kernel-java');
  } else {
    throw new Error(`Unsupported kernel '${kernelId}'`);
  }
  try {
    await fs.access(binaryPath, fs.constants.X_OK);
    return binaryPath;
  } catch (err) {
    // continue to download
  }

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(targetDir, { recursive: true });

  const asset = selectKernelAsset(kernelId, kernelInfo.assets);
  if (!asset || !asset.download_url) {
    throw new Error(`Cannot locate downloadable asset for kernel '${kernelId}'`);
  }

  const tmpFile = path.join(os.tmpdir(), `${kernelId}-${version}-${Date.now()}-${path.basename(asset.name)}`);
  await downloadToFile(asset.download_url, tmpFile);

  try {
    if (kernelId === 'rs') {
      await runCommand('tar', ['-xzf', tmpFile, '-C', targetDir]);
    } else if (kernelId === 'java') {
      await runCommand('tar', ['-xf', tmpFile, '-C', targetDir, '--strip-components=1']);
    }
  } finally {
    await fs.unlink(tmpFile).catch(() => {});
  }

  await fs.chmod(binaryPath, 0o755);
  return binaryPath;
}

function selectKernelAsset(kernelId, assets = []) {
  if (!Array.isArray(assets)) {
    return null;
  }
  if (kernelId === 'rs') {
    return assets.find((asset) => typeof asset.name === 'string' && asset.name.includes('linux-x86_64.tar.gz'));
  }
  if (kernelId === 'java') {
    const predicates = [
      (name) => name.includes('-shadow-') && name.endsWith('.tar'),
      (name) => name.endsWith('.tar'),
    ];
    for (const predicate of predicates) {
      const match = assets.find((asset) => typeof asset.name === 'string' && predicate(asset.name));
      if (match) {
        return match;
      }
    }
    return null;
  }
  return null;
}

async function downloadToFile(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buffer);
}

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const stdoutChunks = [];
    const stderrChunks = [];
    child.stdout.on('data', (chunk) => stdoutChunks.push(chunk));
    child.stderr.on('data', (chunk) => stderrChunks.push(chunk));
    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      resolve({
        code,
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: Buffer.concat(stderrChunks).toString('utf8'),
      });
    });
  });
}

async function runCompose(binaryPath, composePath, { input, env, check } = {}) {
  const args = ['--compose', composePath];
  let inputFile = null;
  if (input && Object.keys(input).length > 0) {
    inputFile = await writeTempJson(input);
    args.push('--input', inputFile);
  }

  const finalEnv = { ...env };
  if (cachedSpecRoot && !finalEnv.SPEC_REPO_PATH) {
    finalEnv.SPEC_REPO_PATH = cachedSpecRoot;
  }
  if (cachedComponentsRoot && !finalEnv.LCOD_COMPONENTS_PATH) {
    finalEnv.LCOD_COMPONENTS_PATH = cachedComponentsRoot;
  }

  const started = performance.now();
  const { code, stdout, stderr } = await runCommand(binaryPath, args, {
    cwd: repoRoot,
    env: finalEnv,
  });
  const durationMs = Math.round(performance.now() - started);

  if (inputFile) {
    await fs.unlink(inputFile).catch(() => {});
  }

  if (code !== 0) {
    const error = new Error(`kernel exited with status ${code}: ${stderr.trim() || 'no stderr output'}`);
    error.durationMs = durationMs;
    throw error;
  }

  let parsed;
  try {
    parsed = JSON.parse(stdout || '{}');
  } catch (err) {
    const error = new Error(`unable to parse kernel output as JSON: ${err.message}`);
    error.durationMs = durationMs;
    throw error;
  }

  if (typeof check === 'function') {
    await check(parsed);
  }
  return { output: parsed, durationMs };
}

async function writeTempJson(payload) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'lcod-components-input-'));
  const file = path.join(dir, 'input.json');
  await fs.writeFile(file, JSON.stringify(payload));
  return file;
}

async function collectJsonSuites() {
  const suitesDir = path.join(repoRoot, 'packages');
  const suites = [];
  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') {
          continue;
        }
        await walk(entryPath);
      } else if (entry.isFile() && entry.name.endsWith('.json') && entryPath.includes(`${path.sep}tests${path.sep}`)) {
        const raw = await fs.readFile(entryPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.tests) && parsed.kind === 'test') {
          suites.push({
            file: entryPath,
            dir: path.dirname(entryPath),
            id: parsed.id ?? entryPath,
            tests: parsed.tests,
          });
        }
      }
    }
  }
  await walk(suitesDir);
  return suites;
}

async function writeJsonCompose(suiteDir, testCase) {
  const compose = {
    compose: [
      {
        call: 'lcod://tooling/test_checker@1',
        in: {
          input: testCase.input ?? {},
          compose: testCase.compose ?? [],
          expected: testCase.expected ?? {},
        },
      },
    ],
  };
  if (testCase.options) {
    compose.compose[0].in.options = testCase.options;
  }
  if (typeof testCase.before === 'object') {
    compose.compose[0].in.before = testCase.before;
  }
  const file = await fs.mkdtemp(path.join(os.tmpdir(), 'lcod-components-case-'));
  const composePath = path.join(file, 'compose.json');
  await fs.writeFile(composePath, JSON.stringify(compose, null, 2));
  return composePath;
}

function ensureTestCheckerSuccess(output) {
  const failures = [];
  const queue = [{ path: '$', value: output }];
  const visited = new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current.value !== 'object' || current.value === null) {
      continue;
    }
    if (visited.has(current.value)) {
      continue;
    }
    visited.add(current.value);
    if (Object.prototype.hasOwnProperty.call(current.value, 'success')) {
      if (current.value.success === false) {
        const messages = Array.isArray(current.value.messages) ? current.value.messages.join('; ') : '';
        failures.push(`${current.path}${messages ? ` => ${messages}` : ''}`);
      }
    }
    for (const [key, child] of Object.entries(current.value)) {
      if (child && typeof child === 'object') {
        const nextPath = Array.isArray(current.value)
          ? `${current.path}[${key}]`
          : `${current.path}.${key}`;
        queue.push({ path: nextPath, value: child });
      }
    }
  }
  if (failures.length > 0) {
    throw new Error(`tooling/test_checker reported failures at ${failures.join(', ')}`);
  }
}

async function detectCapabilities(kernelId, binaryPath, env) {
  const capabilities = new Set();
  const registerCompose = `compose:
  - call: lcod://tooling/resolver/register@1
    in:
      components: []
`;
  if (await probeCompose(binaryPath, env, registerCompose)) {
    capabilities.add('resolver-register');
    capabilities.add('registry-components');
  } else {
    const collectCompose = `compose:
  - call: lcod://tooling/registry_catalog/collect@0.1.0
    in:
      rootPath: "${path.join(repoRoot, 'tests', 'fixtures', 'registry')}"
      catalogPath: "catalog.json"
    out:
      result: $
`;
    if (await probeCompose(binaryPath, env, collectCompose, { projectPath: defaultProjectPath })) {
      capabilities.add('registry-components');
    }
  }

  const tomlCompose = `compose:
  - call: lcod://axiom/toml/parse@1
    in:
      text: "id = \\"demo\\""
    out:
      value: $
`;
  if (await probeCompose(binaryPath, env, tomlCompose)) {
    capabilities.add('toml-parse');
  }

  return capabilities;
}

async function probeCompose(binaryPath, env, composeContent, input) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lcod-cap-'));
  const composePath = path.join(tempDir, 'compose.yaml');
  await fs.writeFile(composePath, composeContent);
  const args = ['--compose', composePath];
  let inputDir;
  if (input && Object.keys(input).length > 0) {
    inputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lcod-cap-input-'));
    const inputFile = path.join(inputDir, 'input.json');
    await fs.writeFile(inputFile, JSON.stringify(input));
    args.push('--input', inputFile);
  }
  const probeEnv = { ...env };
  if (cachedSpecRoot && !probeEnv.SPEC_REPO_PATH) {
    probeEnv.SPEC_REPO_PATH = cachedSpecRoot;
  }
  if (cachedComponentsRoot && !probeEnv.LCOD_COMPONENTS_PATH) {
    probeEnv.LCOD_COMPONENTS_PATH = cachedComponentsRoot;
  }
  const result = await runCommand(binaryPath, args, { cwd: repoRoot, env: probeEnv });
  await fs.rm(tempDir, { recursive: true, force: true });
  if (inputDir) {
    await fs.rm(inputDir, { recursive: true, force: true });
  }
  return result.code === 0;
}

function missingCapabilities(required = [], capabilities) {
  if (!required || required.length === 0) {
    return [];
  }
  return required.filter((cap) => !capabilities.has(cap));
}

function determineJsonRequirements(suiteId, testCase) {
  const requirements = [];
  if (suiteId && suiteId.includes('registry_catalog')) {
    requirements.push('registry-components');
  }
  if (suiteId && suiteId.includes('tooling.mcp')) {
    requirements.push('resolver-register');
  }
  return requirements;
}

async function prepareWorkspaces() {
  const tmpRoot = path.join(repoRoot, 'tests', 'tmp');
  await fs.rm(tmpRoot, { recursive: true, force: true });
  await fs.mkdir(path.join(tmpRoot, 'workspaces'), { recursive: true });
}

async function resolveSpecRoot() {
  const candidates = [];
  const envPath = process.env.SPEC_REPO_PATH;
  if (envPath && envPath.trim().length > 0) {
    candidates.push(envPath.trim());
  }
  candidates.push(path.resolve(repoRoot, '..', 'lcod-spec'));
  candidates.push(path.resolve(repoRoot, '..', '..', 'lcod-spec'));
  candidates.push(path.resolve(repoRoot, '..', 'spec', 'lcod-spec'));
  candidates.push(path.resolve(repoRoot, '..', '..', 'spec', 'lcod-spec'));

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (!stat.isDirectory()) continue;
      const testsDir = path.join(candidate, 'tests', 'spec');
      const testsStat = await fs.stat(testsDir);
      if (testsStat.isDirectory()) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

async function resolveComponentsRoot() {
  const candidates = [];
  const envPath = process.env.LCOD_COMPONENTS_PATH;
  if (envPath && envPath.trim().length > 0) {
    candidates.push(envPath.trim());
  }
  candidates.push(path.resolve(repoRoot, '..', 'lcod-components'));
  candidates.push(path.resolve(repoRoot, '..', '..', 'lcod-components'));

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (!stat.isDirectory()) continue;
      const packagesDir = path.join(candidate, 'packages');
      const pkgStat = await fs.stat(packagesDir);
      if (pkgStat.isDirectory()) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function printResultMatrix(entries, kernels) {
  const displayNames = {
    rs: 'rust',
    java: 'java',
    js: 'node',
  };
  const headerCols = kernels.map((k) => displayNames[k] ?? k);
  const labels = [];
  for (const entry of entries) {
    if (!labels.includes(entry.label)) {
      labels.push(entry.label);
    }
  }
  console.log('\nMatrix:');
  console.log(`| ${headerCols.join(' | ')} | test |`);
  console.log(`| ${headerCols.map(() => '---').join(' | ')} | --- |`);
  for (const label of labels) {
    const row = kernels.map((kernel) => {
      const hit = entries.find((e) => e.kernel === kernel && e.label === label);
      if (!hit) {
        return '–';
      }
      if (hit.status === 'skip') {
        return '–';
      }
      const symbol = hit.status === 'pass' ? '✓' : '✗';
      const duration = typeof hit.durationMs === 'number' && hit.durationMs > 0
        ? ` ${hit.durationMs} ms`
        : '';
      return `${symbol}${duration}`;
    });
    console.log(`| ${row.join(' | ')} | ${label} |`);
  }
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
