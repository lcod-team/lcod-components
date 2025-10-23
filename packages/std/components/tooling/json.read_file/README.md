<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:file-json.svg?height=48&width=48" alt="Read and parse a JSON file from disk." width="48" height="48" /></p>

# lcod://tooling/json/read_file@0.1.0

Read and parse a JSON file from disk.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `basePath` | string | No | Base directory joined with the JSON path. |
| `path` | string | Yes | Path to the JSON file. |
| `encoding` | string | No | File encoding (defaults to utf-8). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Resolved absolute path. |
| `value` | any | Parsed JSON value. |

## Notes

Read and parse a JSON file from disk.
