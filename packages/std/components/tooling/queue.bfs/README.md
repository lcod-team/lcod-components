<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/queue/bfs@0.1.0

Generic breadth-first traversal helper with visited tracking.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | No | Initial queue of items to process. |
| `state` | object | No | Accumulator object passed to each process slot invocation. |
| `visited` | object | No | Optional map of already visited keys. |
| `maxIterations` | integer | No | Optional safety limit for processed items. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `state` | object | Final accumulator state returned by the process slot. |
| `visited` | object | Map of visited keys. |
| `warnings` | array | Warnings surfaced during traversal. |
| `iterations` | integer | Number of processed items. |
