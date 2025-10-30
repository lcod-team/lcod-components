<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry/catalog/generate@0.1.0

Generate registry.json and packages.jsonl content from a catalog definition.

## Notes

## Registry Catalog Generator (`tooling/registry/catalog/generate@0.1.0`)

Builds the two canonical registry artefacts (`registry.json` and `packages.jsonl`) from
a declarative catalog file. The catalog enumerates registries, namespaces, and the
list of packages published by this repository, each pointing at a `versions.json`
descriptor. Every `versions.json` contains the immutable list of published versions
with their manifest paths and hashes.

The component is intentionally pure: it returns the generated payloads so callers
decide where/how to persist them (local write, PR generation, CI updates, …). The
Node-based CI pipeline can run this component through the LCOD kernel (`lcod-kernel-js`),
compare the outputs with the tracked files, and commit changes when the catalogue
evolves.

### Inputs

| Field          | Type   | Description                                                  |
| -------------- | ------ | ------------------------------------------------------------ |
| `rootPath`     | string | Registry repository root (defaults to `.` when omitted).     |
| `catalogPath`  | string | Path to the catalog JSON file (defaults to `catalog.json`).  |

### Outputs

| Field            | Type     | Description                                                                 |
| ---------------- | -------- | --------------------------------------------------------------------------- |
| `packagesJsonl`  | string   | JSON Lines catalogue (registries + component entries).                     |
| `registryJson`   | object   | Structured representation of `registry.json`.                              |
| `packages`       | array    | Diagnostic details per package/versions (useful for tests & tooling).      |
| `warnings`       | string[] | Non-fatal issues (missing manifests, malformed entries, …).                |

### Catalog format

```jsonc
{
  "schema": "lcod-registry@1",
  "registries": [
    { "id": "official", "type": "http", "url": "https://registry.example.com" }
  ],
  "namespaces": {
    "lcod": { "owners": ["github:lcod-team"] }
  },
  "packages": [
    {
      "id": "lcod://tooling/log",
      "registryId": "official",
      "versionsPath": "packages/lcod/tooling/log/versions.json",
      "priority": 10
    }
  ]
}
```

Each `versions.json` mirrors the spec in `docs/registry.md` and includes the
append-only `versions` array. The generator preserves the order defined in each
file (newest first).
