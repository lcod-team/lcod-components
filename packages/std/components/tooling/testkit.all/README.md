<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:clipboard-multiple.svg?height=48&width=48" alt="Execute all discovered testkit cases for a given kernel and return an aggregated plan." width="48" height="48" /></p>

# lcod://tooling/testkit/all@0.1.0

Execute all discovered testkit cases for a given kernel and return an aggregated plan.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `kernel` | string | No | Kernel identifier (e.g. rs, node, java). Defaults to rs. |
| `root` | string | No | Relative path containing testkit cases (defaults to tests/testkit). |
| `projectRoot` | string | No | Absolute path to the repository root (defaults to working directory). |
| `projectPath` | string | No | Legacy alias for projectRoot. |
| `defaultKernels` | array<string> | No | Fallback kernels when a test descriptor does not specify explicit targets. |
| `planId` | string | No | Override the aggregated plan identifier. |
| `planName` | string | No | Override the aggregated plan name. |
| `planDescription` | string | No | Optional description attached to the plan. |
| `planMetadata` | object | No | Optional metadata forwarded to the aggregated plan. |
| `directories` | array<string> | No | Optional list of sub-directories within tests/testkit to execute. |
| `includeHidden` | boolean | No | Include cases whose descriptors set discoverable=false (default: false). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `report` | object | Aggregated plan report containing normalized test cases. |
