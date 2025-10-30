<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/make_repo_docs@0.1.0

Run documentation generation (`make_component_doc` / `make_package_doc`) across multiple LCOD repositories.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `roots` | array<string> | Yes | List of repository directories to scan for `lcp.toml` descriptors. |
| `write` | boolean | No | When true (default), write generated artefacts to disk. |
| `generateComponentDocs` | boolean | No | When true (default), regenerate component artefacts while processing workspace packages. |
| `ignorePatterns` | array<string> | No | Optional list of substring patterns used to skip descriptor paths (e.g. `/node_modules/`). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `processed` | array<object> | Summary of processed descriptors grouped per root directory. |

## Notes

Scans every `lcp.toml` in the provided repositories, filters descriptors with
`schemaVersion = "2.0"`, and invokes `make_component_doc` (for regular
components/contracts/flows) or `make_package_doc` (for workspace packages).

This compose is a convenience wrapper so teams can run:

```
node ../lcod-kernel-js/bin/run-compose.mjs --core --compose tooling/make_repo_docs/compose.yaml --state state.json
```

where `state.json` contains:

```json
{
  "roots": [
    "/path/to/lcod-spec",
    "/path/to/lcod-components",
    "/path/to/lcod-resolver"
  ],
  "write": true
}
```
