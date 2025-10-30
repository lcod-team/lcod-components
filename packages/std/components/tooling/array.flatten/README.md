<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:arrange-bring-forward.svg?height=48&width=48" alt="Flatten an array one level deep, discarding nullish entries." width="48" height="48" /></p>

# lcod://tooling/array/flatten@0.1.0

Flatten an array one level deep, discarding nullish entries.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | No | Array to flatten. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `values` | array | Flattened array without nullish entries. |

## Notes

Returns a new array composed of the non-null values from the input sequence.
Nested arrays are expanded by one level, while `null` and `undefined` entries
are removed.
