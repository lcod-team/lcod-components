<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:playlist-plus.svg?height=48&width=48" alt="Expose core/array/append@1 as a reusable component." width="48" height="48" /></p>

# lcod://core/array/append@0.1.0

Expose core/array/append@1 as a reusable component.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `array` | array | Yes | Base array kept immutable by the contract. |
| `items` | array | No | Items concatenated to the base array. |
| `item` | any | No | Single item appended after `items` when provided. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | array | Resulting array containing the appended entries. |
| `length` | number | Length of the resulting array. |

## Notes

Thin wrapper around `core/array/append@1` that exposes the new standard
primitive as an LCOD component.
