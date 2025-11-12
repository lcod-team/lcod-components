<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tests/testkit/std/plan/testkit_all@0.1.0

Integration test ensuring tooling/testkit/all reports success and failure cases.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `kernel` | string | No | Kernel identifier propagated to tooling/testkit/all (default: rs). |
| `root` | string | No | Root directory passed to tooling/testkit/all (default: tests/testkit). |
| `directories` | array<string> | No | Optional list of sub-directories to scan (default: std/json + std/plan/fixtures). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `report` | any | Result forwarded from tooling/testkit/unit. |
