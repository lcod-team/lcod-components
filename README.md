# lcod-components

Standard LCOD components that can be reused across tooling, registry refresh pipelines and automation flows.

This repository is organised as an LCOD workspace (`workspace.lcp.toml`) with versioned packages under `packages/`. Each package exposes composable blocks (flow operators, tooling helpers) that can be executed by the JS or Rust kernels.

## Goals

- Replace ad-hoc scripts (especially registry refresh scripts) with declarative LCOD components.
- Provide a curated catalogue that other projects can depend on (registry CI, IDE demos, tests).
- Keep components small, documented and covered by tests where possible.

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
