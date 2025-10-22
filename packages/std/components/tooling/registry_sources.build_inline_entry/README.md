<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_sources/build_inline_entry@0.1.0

Convert a processed catalogue entry into an inline registry source contribution.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `entry` | object | No | Processed entry produced by `process_pointer`. |
| `pointer` | object | No | Original normalized pointer (used for fallback metadata). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `contribution` | object | Inline contribution or null when the entry has no materialised lines. |
