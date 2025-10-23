<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:code-json.svg?height=48&width=48" alt="Expose core/json/encode@1 as an LCOD component." width="48" height="48" /></p>

# lcod://core/json/encode@0.1.0

Expose core/json/encode@1 as an LCOD component.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | any | Yes | Data to encode as JSON. |
| `space` | number | No | Indentation width (0-10). |
| `sortKeys` | boolean | No | Sort object keys alphabetically. |
| `asciiOnly` | boolean | No | Escape non-ASCII characters. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `text` | string | JSON representation. |
| `bytes` | number | Number of UTF-8 bytes emitted. |
| `error` | object | Structured error when encoding fails. |

## Notes

Wrapper over `core/json/encode@1` that serialises structured data to JSON text.
