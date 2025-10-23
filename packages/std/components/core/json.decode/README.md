<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:code-json.svg?height=48&width=48" alt="Expose core/json/decode@1 as an LCOD component." width="48" height="48" /></p>

# lcod://core/json/decode@0.1.0

Expose core/json/decode@1 as an LCOD component.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | Yes | JSON source text. |
| `allowComments` | boolean | No | Allow JavaScript-style comments in the input. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | any | Parsed JSON value. |
| `bytes` | number | Number of bytes consumed. |
| `error` | object | Structured error when parsing fails. |

## Notes

Wrapper for the `core/json/decode@1` contract that parses JSON strings into data
structures.
