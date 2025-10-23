<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:format-list-bulleted.svg?height=48&width=48" alt="Return the value when it is an array, otherwise fallback to a default array." width="48" height="48" /></p>

# lcod://tooling/value/default_array@0.1.0

Return the value when it is an array, otherwise fallback to a default array.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | any | No | Candidate list to normalize. |
| `fallback` | array | No | Fallback array returned when the candidate is not an array. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | array | Normalized array. |

## Notes

Return the provided value when it is an array; otherwise fall back to the
supplied default (or an empty array).
