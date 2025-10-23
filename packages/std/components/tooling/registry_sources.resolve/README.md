<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:source-branch.svg?height=48&width=48" alt="Load registry catalogues defined in sources.json and produce inline registry sources." width="48" height="48" /></p>

# lcod://tooling/registry_sources/resolve@0.1.0

Load registry catalogues defined in sources.json and produce inline registry sources.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectPath` | string | No | Project root used to resolve relative pointers. |
| `cacheDir` | string | No | Cache directory root (defaults to project/.lcod/cache). |
| `sourcesPath` | string | No | Explicit path to sources.json. |
| `sourcesText` | string | No | When provided, skip reading from disk and reuse the given JSON payload. |
| `defaultSourcesSpec` | object | No | Default sources specification used when the file is missing. |
| `cwd` | string | No | Working directory fallback when projectPath is not provided. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `registrySources` | array | Inline registry source entries consumed by the resolver. |
| `warnings` | array | Warning messages collected during resolution. |
| `sourcesPath` | string | Final location or label of the sources specification. |
| `projectRoot` | string | Resolved project root. |
| `cacheDir` | string | Resolved cache directory root. |
| `downloadsRoot` | string | Directory used to store downloaded catalogues. |
| `sourcesConfig` | object | Parsed sources specification. |

## Notes

Resolve registry catalogue pointers defined in a `sources.json` specification.
This component orchestrates dedicated helpers to read remote/local catalogues,
validate schemas, and return the inline registry source entries consumed by the
resolver pipeline.
