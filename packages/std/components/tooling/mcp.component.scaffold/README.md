<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/mcp/component/scaffold@0.1.0

Generate a minimal LCOD component skeleton (descriptor, compose, docs) inside a workspace.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `workspacePath` | string | Yes | Workspace directory created for the session (output of `tooling/mcp/session/open@0.1.0`). |
| `componentId` | string | Yes | Component identifier in the form `lcod://namespace/name@version`. |
| `summary` | string | No | Optional summary stored in `lcp.toml` and README. |
| `palette` | object | No | Optional palette overrides (`category`, `icon`, `tags`). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `componentPath` | string | Root directory where the component files were generated. |
| `descriptorPath` | string | Path to the generated `lcp.toml` descriptor. |
| `composePath` | string | Path to the generated `compose.yaml`. |
| `readmePath` | string | Path to `docs/README.md`. |
