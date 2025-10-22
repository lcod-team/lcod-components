<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/path/to_file_url@0.1.0

Convert an absolute filesystem path into a file:// URL.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | No | Absolute filesystem path. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `url` | string | Normalised file:// URL or null when the input is empty. |

## Notes

Convert an absolute filesystem path into a normalised `file://` URL. Backslashes
are replaced by forward slashes and redundant `./` segments are removed.
