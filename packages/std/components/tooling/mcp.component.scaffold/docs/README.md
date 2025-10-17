# tooling/mcp/component/scaffold

Generates the minimal files required for a new LCOD component inside an MCP workspace:

- `lcp.toml` with basic metadata, summary, palette hints, and stub IO definitions.
- `compose.yaml` initialised with an empty pipeline.
- `docs/README.md` seeded with the provided summary and TODO checklist.

## Inputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `workspacePath` | string (required) | Directory produced by `tooling/mcp/session/open@0.1.0`. Files are created relative to this path. |
| `componentId` | string (required) | Identifier of the component (`lcod://namespace/name@version`). |
| `summary` | string (optional) | Short description injected into `lcp.toml` and README. |
| `palette` | object (optional) | Overrides for palette metadata (`category`, `icon`, `tags`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `componentPath` | string | Workspace path where the files were generated. |
| `descriptorPath` | string | Absolute path to `lcp.toml`. |
| `composePath` | string | Absolute path to `compose.yaml`. |
| `readmePath` | string | Absolute path to `docs/README.md`. |

Follow-up components can now populate inputs/outputs, add slots and implementations, or create tests before publishing the component through MCP.
