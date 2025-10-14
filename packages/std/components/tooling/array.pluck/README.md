# lcod://tooling/array/pluck@0.1.0

Extract a property from each object in an array.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `items` | array | No | Array containing objects. |
| `field` | string | Yes | Property name to extract. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `values` | array | Extracted property values (undefined when missing). |
