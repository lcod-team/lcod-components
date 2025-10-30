<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:plus-box-outline.svg?height=48&width=48" alt="Append optional arrays and/or a single value to the provided items." width="48" height="48" /></p>

# lcod://tooling/array/append@0.1.0

Append optional arrays and/or a single value to the provided items.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | No | Source array (defaults to an empty list). |
| `values` | array | No | Additional items appended before `value`. |
| `value` | any | No | Single value appended when provided. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `items` | array | Updated array including the appended value. |
| `length` | number | Length of the array after the append operation. |

## Notes

Append optional arrays and/or a single value to the provided list without
mutating the original array.
