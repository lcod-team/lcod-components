<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:merge.svg?height=48&width=48" alt="Expose core/object/merge@1 (shallow or deep merge) as a component." width="48" height="48" /></p>

# lcod://core/object/merge@0.1.0

Expose core/object/merge@1 (shallow or deep merge) as a component.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `left` | object | Yes | Base object. |
| `right` | object | Yes | Object whose properties overwrite the base object. |
| `deep` | boolean | No | Enable deep merge of nested objects. |
| `arrayStrategy` | string | No | When deep merge is enabled, choose `replace` (default) or `concat` for arrays. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | object | Merged object. |
| `conflicts` | array | Keys overwritten during the merge (top-level only). |

## Notes

Wrapper over the `core/object/merge@1` contract that merges two objects while
keeping the inputs immutable.
