<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:folder-magnify.svg?height=48&width=48" alt="Discover compose-based test cases following common conventions." width="48" height="48" /></p>

# lcod://tooling/testkit/discover@0.1.0

Discover compose-based test cases following common conventions.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `root` | string | No | Relative path (from projectRoot) where testkit cases live (default: tests/testkit). |
| `projectRoot` | string | No | Absolute path to the repository root containing tests/testkit (defaults to working directory). |
| `projectPath` | string | No | Alias for projectRoot maintained for compatibility. |
| `defaultKernels` | array<string> | No | Fallback kernel list when a test does not specify explicit targets. |
| `directories` | array<string> | No | Optional subset of directories (relative to root) to scan. Defaults to all. |
| `includeHidden` | boolean | No | Include tests whose descriptor sets discoverable=false (default: false). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `tests` | array<object> | Discovered test specifications (id, name, kernels, composePath, metadata). |
