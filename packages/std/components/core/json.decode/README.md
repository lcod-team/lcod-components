# lcod://core/json/decode@0.1.0

Wrapper for the `core/json/decode@1` contract that parses JSON strings into data
structures.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `text` | string | Yes | JSON source text (UTF-8). |
| `allowComments` | boolean | No | Allow JavaScript-style comments in the input. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | any | Parsed JSON value. |
| `bytes` | number | Number of bytes consumed. |
| `error` | object | Structured error when parsing fails. |
