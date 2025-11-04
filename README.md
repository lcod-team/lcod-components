# lcod-components

Standard LCOD components that can be reused across tooling, registry refresh pipelines and automation flows.

This repository is organised as an LCOD workspace (`workspace.lcp.toml`) with versioned packages under `packages/`. Each package exposes composable blocks (flow operators, tooling helpers) that can be executed by the JS or Rust kernels.

## Goals

- Replace ad-hoc scripts (especially registry refresh scripts) with declarative LCOD components.
- Provide a curated catalogue that other projects can depend on (registry CI, IDE demos, tests).
- Wrap the standard library primitives (`core/object`, `core/array`, `core/string`, `core/json`) so other composes can consume them without custom scripting. The canonical definitions now live in `lcod-spec` (see `tooling/**` and `core/**`) so kernels can bootstrap deterministically; this workspace keeps optional mirrors/extensions for catalogue publication when needed.
- Keep components small, documented and covered by tests where possible.
- See `docs/COMPONENT_CONVENTIONS.md` for the expected component metadata (summary, palette hints, inputs/outputs).

## Structure

```
workspace.lcp.toml   # declares packages in this workspace
packages/
  std/
    lcp.toml         # package metadata
    components/      # LCOD components organised by namespace
    tests/           # shared declarative tests (JSON) if needed
```

See `docs/PLAN.md` for the high-level roadmap of the initial components.

## Registry exports

Run `npm run export:components` to regenerate the streaming catalogue manifest
consumed by `lcod-registry` and downstream tooling. The command writes
`registry/components.std.jsonl`, a JSON Lines manifest whose first line
describes the list (`lcod-manifest/list@1`) and subsequent lines reference
components with their compose and lcp paths. Legacy JSON exports are no longer
produced now that the resolver pipeline consumes JSONL directly.
