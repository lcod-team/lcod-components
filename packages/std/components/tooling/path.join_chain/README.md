<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:folder.svg?height=48&width=48" alt="Join path segments sequentially starting from an optional base." width="48" height="48" /></p>

# lcod://tooling/path/join_chain@0.1.0

Join path segments sequentially starting from an optional base.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `base` | string | No | Initial path segment. |
| `segments` | array | No | Segments to append in order. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Resolved path after applying all segments. |

## Notes

Combines an initial path with additional segments using the host platform's
filesystem semantics. Nullish or empty segments are ignored.
