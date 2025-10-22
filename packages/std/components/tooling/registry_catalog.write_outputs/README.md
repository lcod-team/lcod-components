<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_catalog/write_outputs@0.1.0

Persist registry artefacts when their content changes.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `rootPath` | string | No | Directory where artefacts are written. |
| `packagesJsonl` | string | Yes | JSON Lines catalogue content to write. |
| `registryJson` | object | Yes | Registry descriptor serialised with indentation. |
| `packagesFilename` | string | No | Override for the JSONL filename. |
| `registryFilename` | string | No | Override for the JSON filename. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `updates` | object | Flags indicating which files were rewritten. |

## Notes

Persist registry artefacts when their content changes.
