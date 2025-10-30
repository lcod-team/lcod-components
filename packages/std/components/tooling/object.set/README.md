<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/object/set@0.1.0

Clone an object and assign a value at a path.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `target` | object | No | Object to clone and mutate; optional. |
| `path` | array | No | Array of string keys describing the path to set. |
| `value` | any | No | Value to assign at the provided path. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `object` | object | Updated object with the assigned value. |
| `previous` | object | Clone of the original object before assignment. |
