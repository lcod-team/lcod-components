# lcod://core/array/append@0.1.0

Thin wrapper around `core/array/append@1` that exposes the new standard
primitive as an LCOD component.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `array` | array | Yes | Base array that remains unchanged. |
| `items` | array | No | Items appended to the array (concatenated). |
| `item` | any | No | Single item appended after `items` when provided. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | array | Resulting array containing the appended entries. |
| `length` | number | Length of the resulting array. |
