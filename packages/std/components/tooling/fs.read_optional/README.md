<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:file-document.svg?height=48&width=48" alt="Read a text file when available, otherwise return fallback text and an optional warning." width="48" height="48" /></p>

# lcod://tooling/fs/read_optional@0.1.0

Read a text file when available, otherwise return fallback text and an optional warning.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | No | File path to read. |
| `encoding` | string | No | File encoding (defaults to utf-8). |
| `fallback` | string | No | Fallback text returned when the file cannot be read. |
| `warningMessage` | string | No | Warning emitted when the fallback is used. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `text` | string | File contents or fallback text. |
| `exists` | boolean | True when the file was read successfully. |
| `warning` | string | Warning emitted when the fallback was returned (null otherwise). |

## Notes

Attempt to read a text file and fall back to a default string when the file is
missing or cannot be read. Optionally emits a warning message.
