<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://core/string/format@0.1.0

Expose core/string/format@1 as an LCOD component.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `template` | string | Yes | Template containing placeholders. |
| `values` | object | No | Dictionary of values injected into the template. |
| `fallback` | string | No | Default replacement when a placeholder cannot be resolved. |
| `missingPolicy` | string | No | How to handle missing placeholders (`ignore` or `error`). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | string | Rendered string. |
| `missing` | array | Placeholders that were not resolved (when `missingPolicy` is `ignore`). |
| `error` | object | Optional structured error when `missingPolicy = "error"`. |

## Notes

Wrapper around the `core/string/format@1` contract that renders template strings
using named placeholders.
