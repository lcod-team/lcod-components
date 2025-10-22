<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/array/shift@0.1.0

Extract the first element of an array and return the remaining items.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | No | Array to shift from; non-arrays are treated as empty. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `head` | any | First element of the array, or null when the array is empty. |
| `rest` | array | Remaining items after removing the first element. |
