<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/component/build_artifacts@0.1.0

Generate README and JSON Schema artefacts from an lcp.toml descriptor.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `descriptorPath` | string | Yes | Path to the descriptor (lcp.toml) file. |
| `write` | boolean | No | When true (default), write artefacts to disk. |
| `readmePath` | string | No | Override destination path for README.md. |
| `inputSchemaPath` | string | No | Override destination path for the generated input schema. |
| `outputSchemaPath` | string | No | Override destination path for the generated output schema. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `descriptor` | object | Parsed descriptor object. |
| `readme` | string | Generated README content. |
| `inputSchema` | object | Generated JSON Schema for component inputs. |
| `outputSchema` | object | Generated JSON Schema for component outputs. |
| `readmePath` | string | Resolved README output path. |
| `inputSchemaPath` | string | Resolved input schema output path. |
| `outputSchemaPath` | string | Resolved output schema output path. |
| `readmeWriteResult` | object | Result from writing the README (empty when write=false). |
| `inputSchemaWriteResult` | object | Result from writing the input schema (empty when skipped). |
| `outputSchemaWriteResult` | object | Result from writing the output schema (empty when skipped). |
