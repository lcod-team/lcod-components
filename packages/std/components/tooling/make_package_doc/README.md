<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/make_package_doc@0.1.0

Generate a package README and (optionally) refresh component artefacts from workspace metadata.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `packageDescriptorPath` | string | Yes | Path to the package descriptor (packages/<name>/lcp.toml). |
| `componentsDir` | string | No | Override the directory holding component descriptors (defaults to <package>/components). |
| `readmePath` | string | No | Override the package README destination (defaults to <package>/README.md). |
| `write` | boolean | No | When true (default), write the package README to disk. |
| `generateComponentDocs` | boolean | No | Regenerate component artefacts while scanning the package (defaults to true). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `descriptor` | object | Parsed package descriptor. |
| `components` | array<object> | Metadata collected for each component in the package. |
| `readme` | string | Generated package README. |
| `readmePath` | string | Resolved package README destination. |

## Notes

Produces a deterministic README for a workspace package by scanning the sibling
`components/` directory, summarising every descriptor, and (optionally)
invoking `make_component_doc` to refresh individual artefacts. The compose can
be run locally or from CI with:

```
lcod-run lcod://tooling/make_package_doc@0.1.0 --input '{ "packageDescriptorPath": ".../packages/foo/lcp.toml" }'
```

Set `generateComponentDocs = false` to only emit the aggregate README without
touching individual component files.
