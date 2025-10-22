<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
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
