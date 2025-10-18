# lcod://tooling/registry_sources/resolve@0.1.0

Resolve registry catalogue pointers defined in a `sources.json` specification.
This component reads remote/local catalogues, validates schemas, and returns the
inline registry source entries consumed by the resolver pipeline.

> ⚠️ This helper currently relies on an embedded script while we upstream the
> low-level helpers (path utilities, checksum logic) into dedicated primitives.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `projectPath` | string | No | Project root (used to resolve relative paths). |
| `cacheDir` | string | No | Cache directory root (defaults to `<project>/.lcod/cache`). |
| `sourcesPath` | string | No | Explicit path to `sources.json` (defaults to `<project>/sources.json`). |
| `sourcesText` | string | No | Raw JSON text when already loaded (optional). |
| `defaultSourcesSpec` | object | No | Default sources specification used when the file is missing. |
| `cwd` | string | No | Working directory fallback when `projectPath` is not provided. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `registrySources` | array | Inline registry sources generated from the catalogues. |
| `warnings` | array | Warning messages collected during resolution. |
| `sourcesPath` | string | Final path/label of the sources file. |
| `projectRoot` | string | Resolved project root. |
| `cacheDir` | string | Resolved cache directory. |
| `downloadsRoot` | string | Directory where remote catalogues were downloaded. |
| `sourcesConfig` | object | Raw parsed sources configuration. |
