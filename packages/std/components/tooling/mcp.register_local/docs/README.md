# tooling/mcp/register_local

Registers MCP authoring components from a local workspace so they become callable by ID during an LCOD run. It loads the compose files from the provided `componentsRoot` (for example `../lcod-components/packages/std/components`) and delegates the actual registration to `tooling/resolver/register@1`.

## Inputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `componentsRoot` | string (required) | Directory containing MCP component folders (`tooling/mcp.session.open`, `tooling/mcp.component.scaffold`, …). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `registered` | number | Number of components that were successfully registered. |
| `warnings` | array | Diagnostics emitted while resolving or registering components. |

Call this component once at the start of a compose (or CLI session) before invoking MCP authoring functions. It is intended for local development and CI environments until the components are published to the official registry.
