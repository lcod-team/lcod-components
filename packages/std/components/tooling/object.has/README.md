<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/object/has@0.1.0

Test whether an object has a value at the specified path.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `target` | object | No | Object to inspect. |
| `path` | array | No | Array of string keys representing the path to check. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `hasKey` | boolean | True when the path resolves to a value. |
| `value` | any | Value found at the path when present. |
