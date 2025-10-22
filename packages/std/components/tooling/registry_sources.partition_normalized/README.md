<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_sources/partition_normalized@0.1.0

Split normalized pointer tuples into a pointer list and accumulated warnings.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `entries` | array | No | Tuples generated while normalizing catalogue pointers. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `pointers` | array | Valid normalized pointers ready to be enqueued. |
| `warnings` | array | Flattened warnings emitted during normalization. |
