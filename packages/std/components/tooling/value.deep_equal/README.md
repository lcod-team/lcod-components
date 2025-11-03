<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:compare-horizontal.svg?height=48&width=48" alt="Compare two values deeply using stable JSON stringification." width="48" height="48" /></p>

# lcod://tooling/value/deep_equal@0.1.0

Compare two values deeply using stable JSON stringification.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `left` | any | No | First value to compare. |
| `right` | any | No | Second value to compare. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `result` | object | Comparison result containing equality flag and stable representations. |

## Notes

Converts both inputs into a deterministic JSON representation (using
`lcod://tooling/json/stable_stringify@0.1.0`) and compares the resulting
strings. The component returns both normalised strings alongside the boolean
`equal` flag so callers can produce diffs or diagnostics.
