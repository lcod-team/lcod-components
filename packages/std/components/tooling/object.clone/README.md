<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/object/clone@0.1.0

Clone a plain object using JSON semantics.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | object | No | Object to clone; non-objects yield an empty object. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `clone` | object | Deep clone of the input when possible; empty object otherwise. |
