<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/mcp/session/open@0.1.0

Create or reuse a workspace folder for MCP authoring sessions.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `workspaceRoot` | string | Yes | Absolute or relative path where session workspaces should be created. |
| `sessionId` | string | No | Optional session identifier; when omitted a new identifier is generated. |
| `componentId` | string | No | Optional component ID linked to the session (stored in provenance metadata). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `sessionId` | string | Identifier assigned to the session workspace. |
| `workspaceRoot` | string | Base directory that contains the session workspaces. |
| `workspacePath` | string | Absolute path to the session workspace. |
| `provenancePath` | string | Path to the generated provenance file for this session. |
