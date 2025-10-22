<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_catalog/validate@0.1.0

Validate the registry catalog against structural and manifest rules.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `rootPath` | string | No | Base directory used to resolve catalog and package files. |
| `catalogPath` | string | No | Path to catalog.json relative to rootPath. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `errors` | array | Validation errors (empty array means the catalogue is valid). |
| `packages` | array | Per-package diagnostics produced during validation. |

## Notes

Validate the registry catalog against structural and manifest rules.
