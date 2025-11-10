<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:beaker-check.svg?height=48&width=48" alt="Run an embedded compose-based test case inside the current kernel." width="48" height="48" /></p>

# lcod://tooling/testkit/unit@0.1.0

Run an embedded compose-based test case inside the current kernel.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No | Stable identifier for the test (used in reports). |
| `name` | string | No | Human-friendly name displayed in reports. |
| `description` | string | No | Optional free-text description of the scenario. |
| `metadata` | object | No | Arbitrary metadata forwarded to verify/teardown slots and returned in the report. |
| `context` | object | No | Context object forwarded to setup/verify slots. |
| `targetInput` | object | No | Payload forwarded to the target slot. |
| `setupInput` | object | No | Payload forwarded to the setup slot when provided. |
| `verifyInput` | object | No | Additional payload forwarded to the verify slot. |
| `teardownInput` | object | No | Additional payload forwarded to the teardown slot. |
| `expect` | any | No | Expected value compared against the target output (deep equality). |
| `skipSetup` | boolean | No | Disable the setup slot even if provided. |
| `skipTeardown` | boolean | No | Disable the teardown slot even if provided. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `result` | object | Simplified report for the test case. |

## Slots

### setup
Optional compose steps executed before the target call.

### target
Compose steps that exercise the component under test.

### verify
Optional verification hook receiving { output, expect, metadata, assertion }.

### teardown
Optional cleanup hook executed after the test.
