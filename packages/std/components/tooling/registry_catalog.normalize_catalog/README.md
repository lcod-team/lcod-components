<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:notebook-check-outline.svg?height=48&width=48" alt="Normalise the top-level catalog document." width="48" height="48" /></p>

# lcod://tooling/registry_catalog/normalize_catalog@0.1.0

Normalise the top-level catalog document.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `catalog` | object | No | Catalog document to normalise. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `registries` | array | Filtered registry entries. |
| `packages` | array | Filtered package entries. |
| `namespaces` | object | Namespace configuration. |
| `schema` | string | Catalog schema identifier. |
| `warnings` | array | Issues detected during normalisation. |

## Notes

Normalise the top-level catalog document.
