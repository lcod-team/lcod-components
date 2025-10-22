<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_sources/collect_queue@0.1.0

Traverse the catalogue pointer queue breadth-first and emit inline contributions.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `queue` | array | No | Normalized pointers waiting to be processed. |
| `downloadsRoot` | string | No | Directory used for downloaded catalogues. |
| `sourcesBaseDir` | string | No | Root directory for relative catalogue pointers. |
| `defaultEntrypoint` | object | No | Entrypoint defaults inherited by child pointers. |
| `basePriority` | any | No | Base priority that should be forwarded to pointer helpers. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `contributions` | array | Inline contributions collected from processed catalogues. |
| `warnings` | array | Warnings collected while processing the queue. |
