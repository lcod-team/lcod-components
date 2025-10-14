# registry_catalog.refresh

High-level component that orchestrates catalogue collection and validation.
It runs `registry_catalog.collect` followed by `registry_catalog.validate`
and returns both the generated artefacts and diagnostics.

## Inputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rootPath` | string (optional) | Base directory used to resolve catalogue and package files. |
| `catalogPath` | string (optional) | Path to `catalog.json` relative to `rootPath`. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `packagesJsonl` | string | JSON Lines catalogue produced by the collect step. |
| `registryJson` | object | Registry descriptor (`registry.json`). |
| `packages` | array | Collect step diagnostics (per package versions/manifests). |
| `warnings` | array | Non-fatal issues emitted by the collect step. |
| `errors` | array | Validation errors (empty array means the catalogue is valid). |
| `validation` | array | Per-package validation diagnostics. |

Combine this component with `registry_catalog.write_outputs` to refresh the
registry artefacts in a single compose.
