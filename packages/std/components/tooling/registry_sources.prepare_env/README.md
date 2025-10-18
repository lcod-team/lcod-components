# lcod://tooling/registry_sources/prepare_env@0.1.0

Resolve the working directories required by the registry sources pipeline. The
component normalises the project root (falling back to the provided `cwd`),
derives the cache folder, and returns the dedicated downloads directory used to
store fetched catalogues.

## Inputs

- `projectPath` *(string, optional)* — Explicit project root (absolute or
  relative to `cwd`).
- `cacheDir` *(string, optional)* — Cache directory. Defaults to
  `<project>/.lcod/cache`.
- `cwd` *(string, optional)* — Working directory fallback when `projectPath`
  is relative or missing.

## Outputs

- `projectRoot` *(string)* — Normalised project root.
- `cacheDir` *(string)* — Cache directory path.
- `downloadsRoot` *(string)* — Directory used to download remote catalogues.
