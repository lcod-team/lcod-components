# Component Conventions

This repository hosts reusable LCOD components. Each component directory
follows a lightweight structure so that IDEs (and AI assistants) can build
an auto-documented palette without scanning additional files.

```
components/<namespace>/<name>/
  lcp.toml        # descriptor (identity, metadata, dependencies)
  compose.yaml    # implementation (for composites)
  README.md       # human-friendly summary (optional but recommended)
  schema/         # optional JSON Schemas when inputs/outputs get large
  tests/          # optional declarative tests
  assets/         # optional icons or supporting artefacts
```

## lcp.toml metadata

Each descriptor extends the standard `lcp.toml` fields with the following
conventions:

```toml
summary = "One-line description shown in palettes"

[palette]
category = "Registry"
icon = "mdi:database-cog-outline"   # mdi:<name> or relative path to SVG
tags = ["catalog", "resolver"]      # optional facet hints

[docs]
readme = "README.md"                # optional long-form description

[[io.input]]
name = "rootPath"
type = "string"
required = false
description = "Base path used to resolve relative catalog files."

[[io.output]]
name = "packagesJsonl"
type = "string"
description = "JSON Lines text listing registry and component entries."
```

- `summary` and `[palette]` allow the IDE to render the component in a tree or
  search palette with the right icon.
- `[[io.input]]` / `[[io.output]]` give a concise description of the expected
  data shape. For complex schemas, put the JSON Schema under `schema/` and
  reference it via `tool.inputSchema` / `tool.outputSchema`.
- `README.md` can provide longer examples, edge cases or troubleshooting notes.

## Tests

Where possible, keep component tests declarative (`tests/*.json`) so that both
kernels can execute them. These tests typically call the component once and
assert on its final state.

## Palette generation

Future automation (`tooling/components/publish`) will parse the metadata above
to build a consumable palette index (JSON) for IDEs and pipelines. Until then,
keeping the descriptors consistent ensures a smooth migration once the tooling
lands.
