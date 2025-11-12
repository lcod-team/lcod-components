<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:clipboard-list.svg?height=48&width=48" alt="Aggregate multiple testkit/unit cases, producing a consolidated report." width="48" height="48" /></p>

# lcod://tooling/testkit/plan@0.1.0

Aggregate multiple testkit/unit cases, producing a consolidated report.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No | Stable identifier for the plan. |
| `name` | string | No | Human-friendly name displayed in the final report. |
| `description` | string | No | Optional free-text description of the plan. |
| `metadata` | object | No | Plan-level metadata forwarded to the tests slot. |
| `context` | object | No | Context object forwarded to the tests slot. |
| `entries` | array | No | Optional array of precomputed test results to merge (useful for static reporting). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `plan` | object | Aggregated report with plan metadata, summary counts, and individual cases. |

## Slots

### tests
Must produce an array of test results (typically by calling testkit/unit).
