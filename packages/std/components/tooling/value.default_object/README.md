# lcod://tooling/value/default_object@0.1.0

Return the provided value when it is a non-null object; otherwise fall back to
the supplied default (or an empty object).

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `value` | any | No | Candidate value to normalize. |
| `fallback` | object | No | Object returned when `value` is not an object (defaults to `{}`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | object | Normalized object (either the original value, fallback, or `{}`). |
