<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:code-braces-box.svg?height=48&width=48" alt="Return the value when it is an object, otherwise fallback to a default." width="48" height="48" /></p>

# lcod://tooling/value/default_object@0.1.0

Return the value when it is an object, otherwise fallback to a default.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | any | No | Candidate value to normalize. |
| `fallback` | object | No | Fallback object returned when the candidate is not an object. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | object | Normalized object. |

## Notes

Return the provided value when it is a non-null object; otherwise fall back to
the supplied default (or an empty object).
