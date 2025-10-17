# tooling/mcp/session/open

Creates a workspace directory for an MCP authoring session. The component:

1. Resolves the absolute workspace path (`workspaceRoot` + `sessionId`).
2. Ensures the directory exists (writes a `.keep` file with `createParents`).
3. Generates `.lcod/provenance.json` recording the session creation metadata.

## Inputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `workspaceRoot` | string (required) | Base directory where all MCP sessions are stored. |
| `sessionId` | string (optional) | Explicit session identifier. If omitted, a random identifier is generated. |
| `componentId` | string (optional) | Component ID associated with the session, recorded in provenance metadata. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `sessionId` | string | Identifier used for the workspace folder. |
| `workspaceRoot` | string | Root directory that contains the workspace. |
| `workspacePath` | string | Absolute path to the session workspace. |
| `provenancePath` | string | Path to `.lcod/provenance.json` generated for the session. |

Use this component as the first step of an MCP workflow before scaffolding or editing components. The provenance file can be enriched by later steps to capture every mutation applied during the session.
