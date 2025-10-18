# lcod://core/object/merge@0.1.0

Wrapper over the `core/object/merge@1` contract that merges two objects while
keeping the inputs immutable.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `left` | object | Yes | Base object. |
| `right` | object | Yes | Object whose values overwrite the base object. |
| `deep` | boolean | No | When `true`, merge nested objects recursively. |
| `arrayStrategy` | string | No | Array merge mode when `deep` is true (`replace` or `concat`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | object | Resulting merged object. |
| `conflicts` | array | Optional list of top-level keys overwritten during the merge. |
