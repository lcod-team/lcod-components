<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/json/decode_object@0.1.0

Decode JSON text and ensure the result is an object, falling back when needed.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | No | JSON text to decode. |
| `fallback` | object | No | Fallback object returned when decoding fails or the value is not an object. |
| `warningMessage` | string | No | Warning emitted when decoding fails (defaults to a generic message). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | object | Decoded JSON object or fallback. |
| `warnings` | array | Warning messages (empty when decoding succeeds). |
| `error` | object | Structured error when decoding fails or the result is not an object. |

## Notes

Decode a JSON string and ensure the result is an object. When parsing fails or
produces a non-object value, a fallback object is returned along with a warning.
