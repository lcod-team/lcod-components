# lcod://tooling/fs/read_optional@0.1.0

Attempt to read a text file and fall back to a default string when the file is
missing or cannot be read. Optionally emits a warning message.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `path` | string | No | Absolute or relative path to read. When omitted, the fallback is returned. |
| `encoding` | string | No | File encoding (`utf-8` by default). |
| `fallback` | string | No | Text returned when the file cannot be read (defaults to empty string). |
| `warningMessage` | string | No | Warning message returned when the file is missing/unreadable. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | string | File contents or fallback text. |
| `exists` | boolean | `true` when the file was read successfully. |
| `warning` | string | Warning emitted when the fallback is used (null otherwise). |
