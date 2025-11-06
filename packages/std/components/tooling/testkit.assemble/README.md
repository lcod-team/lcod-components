<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:table-multiple.svg?height=48&width=48" alt="Assemble multiple testkit plans into a kernel-by-test matrix." width="48" height="48" /></p>

# lcod://tooling/testkit/assemble@0.1.0

Assemble multiple testkit plans into a kernel-by-test matrix.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `reports` | array<object> | No | Array of plan reports produced by tooling/testkit.all. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `matrix` | object | Aggregated matrix with kernel summary and per-test statuses. |

## Slots

### reports
Optional slot supplying additional reports (array or single plan).
