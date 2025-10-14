# registry_catalog.write_outputs

Write the generated catalogue artefacts to disk only when their content
changes. The component normalises the JSON/JSONL outputs (newline, indent)
and avoids unnecessary filesystem writes.

## Inputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rootPath` | string (optional) | Directory where artefacts should be written (defaults to the working directory). |
| `packagesJsonl` | string | JSON Lines catalogue content produced by `registry_catalog.collect` or `registry_catalog.refresh`. |
| `registryJson` | object | Registry descriptor (`registry.json`). |
| `packagesFilename` | string (optional) | Override for the JSONL filename (defaults to `packages.jsonl`). |
| `registryFilename` | string (optional) | Override for the JSON filename (defaults to `registry.json`). |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `updates` | object | Flags indicating which files were rewritten (`packagesJsonl`, `registryJson`). |

Combine this component with `registry_catalog.refresh` to build a
self-contained registry refresh pipeline.
