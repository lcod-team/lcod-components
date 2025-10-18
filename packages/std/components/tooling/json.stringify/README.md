# lcod://tooling/json/stringify@0.1.0

Serialize a value into JSON text using the standard JSON encode primitive.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `value` | any | Yes | Value to serialize. |
| `indent` | number | No | Number of spaces used for indentation (0-10). |
| `sortKeys` | boolean | No | Sort object keys alphabetically. |
| `asciiOnly` | boolean | No | Escape non-ASCII characters. |
| `trailingNewline` | boolean | No | Append a newline when true. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `json` | string | Serialized JSON string (newline appended when `trailingNewline` is true). |
