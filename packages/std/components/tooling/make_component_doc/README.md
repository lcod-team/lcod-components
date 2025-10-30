<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/make_component_doc@0.1.0

Generate a component README and JSON Schemas from a single lcp.toml descriptor.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `descriptorPath` | string | Yes | Absolute or relative path to the component descriptor (lcp.toml). |
| `write` | boolean | No | When true (default), write generated artefacts to disk. |
| `readmePath` | string | No | Optional override for the README destination. |
| `inputSchemaPath` | string | No | Optional override for the input schema destination. |
| `outputSchemaPath` | string | No | Optional override for the output schema destination. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `descriptor` | object | Parsed component descriptor. |
| `readme` | string | Generated README content. |
| `inputSchema` | object | Generated JSON Schema for inputs. |
| `outputSchema` | object | Generated JSON Schema for outputs. |
| `readmePath` | string | Resolved README output path. |
| `inputSchemaPath` | string | Resolved input schema output path. |
| `outputSchemaPath` | string | Resolved output schema output path. |
| `readmeWriteResult` | object | Result from writing the README (empty when skipped). |
| `inputSchemaWriteResult` | object | Result from writing the input schema (empty when skipped). |
| `outputSchemaWriteResult` | object | Result from writing the output schema (empty when skipped). |

## Notes

Wrapper around `tooling/component/build_artifacts@0.1.0`. Accepts a single
component descriptor and returns the generated README plus JSON Schemas. When
`write` is left to its default (`true`), the artefacts are written next to the
descriptor so the command can be used locally or in CI via:

```
lcod-run lcod://tooling/make_component_doc@0.1.0 --input '{ "descriptorPath": ".../lcp.toml" }'
```
