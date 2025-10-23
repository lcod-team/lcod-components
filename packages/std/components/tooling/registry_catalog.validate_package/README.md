<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:package-search.svg?height=48&width=48" alt="Validate a single package entry and its manifests." width="48" height="48" /></p>

# lcod://tooling/registry_catalog/validate_package@0.1.0

Validate a single package entry and its manifests.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `rootPath` | string | No | Base directory used to resolve manifest and versions files. |
| `packageEntry` | object | Yes | Package definition extracted from catalog.json. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `packageErrors` | array | Validation issues for the package. |
| `packageId` | string | Canonical package identifier (when resolved). |

## Notes

Validate a single package entry and its manifests.
