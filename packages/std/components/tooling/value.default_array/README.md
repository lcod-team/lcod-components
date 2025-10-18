# lcod://tooling/value/default_array@0.1.0

Return the provided value when it is an array; otherwise fall back to the
supplied default (or an empty array).

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `value` | any | No | Candidate list to normalize. |
| `fallback` | array | No | Array returned when `value` is not an array (defaults to `[]`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | array | Normalized array (original value, fallback, or `[]`). |
