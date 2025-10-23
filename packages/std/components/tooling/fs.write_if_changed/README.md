<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:file-replace.svg?height=48&width=48" alt="Write a file only when the content differs." width="48" height="48" /></p>

# lcod://tooling/fs/write_if_changed@0.1.0

Write a file only when the content differs.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Destination file path. |
| `content` | string | No | Content written to the file (coerced to string). |
| `encoding` | string | No | Encoding used when reading existing content (defaults to utf-8). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `changed` | boolean | True when the file was rewritten. |

## Notes

Write a file only when the content differs.
