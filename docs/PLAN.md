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

5. **Testkit orchestration** ([#11](https://github.com/lcod-team/lcod-components/issues/11)):
   - Define a `tooling/testkit.unit@1` component able to run a compose-based test
     (setup, target compose with slots, expectations, metrics) inside the current kernel.
   - Provide a `tooling/testkit.plan@1` aggregator that discovers unit tests (glob
     or explicit list), executes them sequentially/parallel in a single kernel
     instance, and emits a structured report.
   - Add helper stubs (`tooling/testkit/emitter@1`, `tooling/testkit/spy@1`, …)
     to generate fixtures and capture slot activity.
   - Update the repository runner (`scripts/run-tests.mjs`) to drive the plan and
     collect per-kernel matrices.

The focus for the next iteration is milestone 2 and 5: replicate the behaviour of
the current `package-runtime` / registry catalog scripts through declarative
components, and introduce the compose-native testkit.

## Next steps

- Define the first package manifest (`packages/std/lcp.toml`).
- Introduce a component to load registry sources (mirrors
  `tooling/registry/source/load`).
- Write a small compose that runs the existing registry catalog pipeline end to
  end.
