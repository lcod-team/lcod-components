<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:format-line-spacing.svg?height=48&width=48" alt="Ensure a string ends with a trailing newline character." width="48" height="48" /></p>

# lcod://tooling/string/ensure_trailing_newline@0.1.0

Ensure a string ends with a trailing newline character.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | No | Text to normalise. |
| `newline` | string | No | Newline sequence (defaults to "
"). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `text` | string | Normalised text guaranteed to end with the newline sequence. |

## Notes

Returns the provided text, adding a newline suffix when it is not already
present. The newline sequence can be customised via the optional `newline`
input (defaults to "
").
