# lcod://core/json/encode@0.1.0

Wrapper over `core/json/encode@1` that serialises structured data to JSON text.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `value` | any | Yes | Data to encode. |
| `space` | number | No | Indentation width (0-10). |
| `sortKeys` | boolean | No | When `true`, sort object keys alphabetically. |
| `asciiOnly` | boolean | No | Escape non-ASCII characters. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | string | JSON representation. |
| `bytes` | number | Number of UTF-8 bytes emitted. |
| `error` | object | Structured error when encoding fails. |
