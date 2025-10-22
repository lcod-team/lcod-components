<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/path/join_chain@0.1.0

Join a base path with a sequence of segments using path axioms.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `base` | string | No | Base path (defaults to empty string). |
| `segments` | array | No | Ordered list of segments to append. Nullish entries are ignored. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Resulting joined path. |

## Notes

Join a base path with an ordered list of segments. Null or empty segments are
skipped, and intermediate joins delegate to the standard `path/join` axiom.
