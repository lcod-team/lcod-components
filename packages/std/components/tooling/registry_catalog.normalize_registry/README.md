<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_catalog/normalize_registry@0.1.0

Normalise a registry entry declared in catalog.json.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `entry` | object | Yes | Registry entry to validate. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `ok` | boolean | True when the registry entry is valid. |
| `line` | object | Registry line inserted into the JSONL output. |
| `warnings` | array | Issues detected for the registry entry. |

## Notes

Normalise a registry entry declared in catalog.json.
