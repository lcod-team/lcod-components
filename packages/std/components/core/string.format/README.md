# lcod://core/string/format@0.1.0

Wrapper around the `core/string/format@1` contract that renders template strings
using named placeholders.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `template` | string | Yes | Template containing placeholders (`{name}` syntax). |
| `values` | object | No | Dictionary of replacement values referenced by placeholders. |
| `fallback` | string | No | Default replacement when a placeholder cannot be resolved. |
| `missingPolicy` | string | No | How to handle missing placeholders (`ignore` or `error`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | string | Rendered string. |
| `missing` | array | Placeholders that were not resolved (when policy is `ignore`). |
| `error` | object | Structured error emitted when `missingPolicy = "error"`. |
