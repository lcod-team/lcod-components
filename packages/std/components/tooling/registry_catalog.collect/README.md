# registry_catalog.collect

Collect registry entries declared in `catalog.json` (and associated
`versions.json` files) and emit the aggregated catalogue artefacts.

## Inputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rootPath` | string (optional) | Base directory used to resolve relative paths (defaults to the working directory). |
| `catalogPath` | string (optional) | Path to `catalog.json` relative to `rootPath` (defaults to `catalog.json`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `packagesJsonl` | string | JSON Lines document listing registry and component entries. |
| `registryJson` | object | Registry descriptor ready to be written to `registry.json`. |
| `packages` | array | Per-package diagnostics (versions and manifests). |
| `warnings` | array | Non-fatal issues encountered during the collection phase. |

Use this component alongside `registry_catalog.validate` and
`registry_catalog.write_outputs` to refresh the registry artefacts.
