# registry_catalog.validate

Validate the catalogue structure produced by `registry_catalog.collect`.
It detects duplicate packages, missing manifests, incorrect version ordering
and placeholder metadata.

## Inputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rootPath` | string (optional) | Base directory used to resolve catalogue and package files (defaults to the working directory). |
| `catalogPath` | string (optional) | Path to `catalog.json` relative to `rootPath` (defaults to `catalog.json`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `errors` | array | List of validation errors. Empty array means the catalogue is valid. |
| `packages` | array | Per-package diagnostics describing the detected issues. |

Run this component after collection and before writing artefacts to fail the
pipeline when structural issues are present.
