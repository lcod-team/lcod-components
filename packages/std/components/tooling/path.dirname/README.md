<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:folder-arrow-left.svg?height=48&width=48" alt="Return the parent directory of a given path." width="48" height="48" /></p>

# lcod://tooling/path/dirname@0.1.0

Return the parent directory of a given path.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Target path. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `dirname` | string | Parent directory. |

## Notes

Return the parent directory of a given path. This is a lightweight wrapper
around `tooling/path/join_chain` that appends `..` to the provided path.
