<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:folder-cog.svg?height=48&width=48" alt="Resolve project, cache and downloads directories used by registry source resolution." width="48" height="48" /></p>

# lcod://tooling/registry_sources/prepare_env@0.1.0

Resolve project, cache and downloads directories used by registry source resolution.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectPath` | string | No | Optional project root path (relative paths are resolved from cwd). |
| `cacheDir` | string | No | Optional cache directory (defaults to `<project>/.lcod/cache`). |
| `cwd` | string | No | Explicit working directory used when projectPath is relative. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `projectRoot` | string | Resolved project root directory. |
| `cacheDir` | string | Resolved cache directory path. |
| `downloadsRoot` | string | Directory dedicated to downloaded catalogues. |

## Notes

Resolve the working directories required by the registry sources pipeline. The
component normalises the project root (falling back to the provided `cwd`),
derives the cache folder, and returns the dedicated downloads directory used to
store fetched catalogues.
