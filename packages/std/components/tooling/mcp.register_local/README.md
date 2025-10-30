<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:integration-helper.svg?height=48&width=48" alt="Register MCP authoring components located on disk (e.g. lcod-components workspace) so they can be used in local workflows." width="48" height="48" /></p>

# lcod://tooling/mcp/register_local@0.1.0

Register MCP authoring components located on disk (e.g. lcod-components workspace) so they can be used in local workflows.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `componentsRoot` | string | Yes | Filesystem path containing MCP component directories (e.g. lcod-components/packages/std/components). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `registered` | number | Number of components successfully registered. |
| `warnings` | array | Diagnostics collected while resolving or registering components. |
