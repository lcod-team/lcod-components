<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:alert-octagon-outline.svg?height=48&width=48" alt="Return duplicated string values present in an array." width="48" height="48" /></p>

# lcod://tooling/array/find_duplicates@0.1.0

Return duplicated string values present in an array.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | No | Array to inspect. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `duplicates` | array<string> | Array of duplicated string values. |

## Notes

Scans the provided array and returns the set of string values that appear more
than once. Non-string entries are ignored.
