# lcod://tooling/registry_catalog/collect@0.1.0

Collect registry metadata into JSONL and JSON descriptors.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `rootPath` | string | No | Base directory used to resolve relative catalog and versions files. |
| `catalogPath` | string | No | Path to catalog.json relative to rootPath. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `packagesJsonl` | string | JSON Lines document describing registries and components. |
| `registryJson` | object | Registry descriptor ready to be written to registry.json. |
| `packages` | array | Per-package diagnostics (versions metadata). |
| `warnings` | array | Non-fatal issues encountered during collection. |
