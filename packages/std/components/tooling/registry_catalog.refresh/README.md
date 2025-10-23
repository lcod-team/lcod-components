<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:database-refresh.svg?height=48&width=48" alt="Collect and validate registry data, ready to publish artefacts." width="48" height="48" /></p>

# lcod://tooling/registry_catalog/refresh@0.1.0

Collect and validate registry data, ready to publish artefacts.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `rootPath` | string | No | Base directory used to resolve catalogue files. |
| `catalogPath` | string | No | Path to catalog.json relative to rootPath. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `packagesJsonl` | string | JSON Lines catalogue emitted by the collect step. |
| `registryJson` | object | Registry descriptor ready to be written to registry.json. |
| `packages` | array | Collect step diagnostics (per package). |
| `warnings` | array | Non-fatal issues reported during collection. |
| `errors` | array | Validation errors (empty array means success). |
| `validation` | array | Per-package validation diagnostics. |

## Notes

Collect and validate registry data, ready to publish artefacts.
