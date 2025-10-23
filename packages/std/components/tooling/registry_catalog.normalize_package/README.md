<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:package-variant.svg?height=48&width=48" alt="Validate and normalise a package entry." width="48" height="48" /></p>

# lcod://tooling/registry_catalog/normalize_package@0.1.0

Validate and normalise a package entry.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `entry` | object | Yes | Package entry from catalog.json. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `ok` | boolean | True when the package entry is valid. |
| `id` | string | Package identifier when valid. |
| `registryId` | string | Associated registry identifier. |
| `versionsPath` | string | Path to the versions document. |
| `priority` | number | Package-level priority (nullable). |
| `warnings` | array | Issues detected while processing the package. |

## Notes

Validate and normalise a package entry.
