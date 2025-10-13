# Initial Plan

## Context

The registry repository currently relies on Node.js scripts to:

1. Collect package metadata and prepare `registry.json` / `packages.jsonl`.
2. Validate the generated artefacts (schema checks, duplicate detection, etc.).
3. Publish these artefacts as part of the release workflow.

We want to express these steps as LCOD components so that the same logic can be
reused from the `run_compose` CLI or from any kernel. This repository will host
those reusable blocks.

## Milestones

1. **Workspace skeleton** (this commit): workspace manifest, std package, doc
   folder.
2. **Catalog helpers** (`tooling/registry/catalog/*`):
   - Load catalogue manifests from disk.
   - Validate entries (schema + duplicates).
   - Emit aggregated JSONL / JSON outputs.
3. **Validation helpers** (`tooling/registry/validate/*`):
   - Schema validation components.
   - Integrity checks (hashes, missing files).
4. **Publishing helpers** (`tooling/registry/publish/*`):
   - Prepare release artefacts.
   - Interact with storage (GitHub release, S3, etc.).

The focus for the next iteration is milestone 2: replicate the behaviour of the
current `package-runtime` / registry catalog scripts through declarative
components.

## Next steps

- Define the first package manifest (`packages/std/lcp.toml`).
- Introduce a component to load registry sources (mirrors
  `tooling/registry/source/load`).
- Write a small compose that runs the existing registry catalog pipeline end to
  end.
