<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:file-document-edit.svg?height=48&width=48" alt="Write text to a file only when the contents change." width="48" height="48" /></p>

# lcod://tooling/fs/write_if_changed@0.1.0

Write text to a file only when the contents change.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Destination file path. |
| `content` | any | No | Content to write. |
| `encoding` | string | No | Text encoding used to read and write (defaults to "utf-8"). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `changed` | boolean | True when the file was written because the content changed. |

## Notes

Normalises the provided content to a string, compares it with the current file
contents (using the requested encoding) and writes the file only when the data
changes. The component reports whether the file was modified.
