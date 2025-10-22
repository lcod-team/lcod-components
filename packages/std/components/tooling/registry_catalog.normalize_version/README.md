<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_catalog/normalize_version@0.1.0

Normalise a single package version entry.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `packageId` | string | No | Parent package identifier. |
| `registryId` | string | No | Registry identifier applied to the version. |
| `packagePriority` | number | No | Default priority declared at package level. |
| `entry` | object | Yes | Version entry to normalise. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `ok` | boolean | True when the version entry is valid. |
| `line` | object | Component line for the JSONL output. |
| `detail` | object | Simplified version details used by diagnostics. |
| `warnings` | array | Issues detected for the version entry. |

## Notes

Normalise a single package version entry.
