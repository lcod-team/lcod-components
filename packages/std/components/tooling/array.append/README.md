# lcod://tooling/array/append@0.1.0

Append values to an array without mutating the original list. Relies on the
standard `core/array/append@1` primitive.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `items` | array | No | Source array (defaults to an empty list). |
| `value` | any | No | Single value appended at the end when provided. |
| `values` | array | No | Additional items concatenated before `value`. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | array | Updated array including the appended entries. |
| `length` | number | Length of the array after the append operation. |
