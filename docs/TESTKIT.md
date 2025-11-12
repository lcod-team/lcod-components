# Testkit conventions

This document describes how LCOD packages (lcod-components, lcod-resolver, lcod-rag,
etc.) should organise their compose-based tests so every kernel can run them through
`tooling/testkit`.

## Repository layout

Each package must expose a `workspace.lcp.toml` at the root and a sibling `tests/`
directory that mirrors the following structure:

```
tests/
  testkit/
    <namespace>/
      <scenario>/
        compose.yaml
        lcp.toml
        README.md        # generated via build-component-artifacts.mjs
        test.json        # optional metadata consumed by higher level plans
```

- `compose.yaml` **must** start with `call: lcod://tooling/testkit/unit@…` so the
  scenario can be executed directly with `lcod run`.
- `lcp.toml` declares the component id (e.g. `lcod://tests/testkit/std/json/decode_success@0.1.0`),
  inputs/outputs, and dependencies. The ID lives under the `tests/testkit/...`
  namespace to avoid collisions with the production components shipped in `packages/std`.
- `test.json` (optional) can provide additional metadata (human readable name,
  kernel matrix hints, etc.) for discovery tools. When present it should at
  least expose:
  - `componentId`: the LCOD identifier to execute (usually the local
    `lcod://tests/testkit/...` defined by `lcp.toml`).
  - `kernels`: optional list of kernels this case targets.
  - `discoverable`: set to `false` for hidden fixtures that should only run
    when explicitly requested (e.g. via `includeHidden=true`).
  - `metadata`/`tags`: any free-form information surfaced in aggregated
    reports.
- All references inside the compose should be **relative** to the current workspace
  so we do not depend on cached/spec-registry entries.

## Execution

A dedicated runner (`lcod://tooling/testkit/all@…`) now:

1. Discover all `tests/testkit/**/compose.yaml` entries in the current workspace
   (and any extra paths listed in `LCOD_WORKSPACE_PATHS`). Use the `directories`
   input to limit the scan to a subset (e.g. `['std/json']`).
2. Execute them sequentially inside the same kernel instance to avoid repeated
   warmups.
3. Emit a JSON report that lists every case with its `status`, raw `result`,
   and summary counters (`total/passed/failed/error/skipped`).

Once this plan lands, running the full suite reduces to:

```bash
LCOD_WORKSPACE_PATHS=/path/to/repo \
  lcod run --kernel rs lcod://tooling/testkit/all@0.1.0 root=tests/testkit
```

You can switch kernels (`--kernel node` / `--kernel java`) or restrict the scope:

```bash
# Only run tests under tests/testkit/std/json
LCOD_WORKSPACE_PATHS=/path/to/repo \
  lcod run --kernel rs lcod://tooling/testkit/all@0.1.0 \
    root=tests/testkit \
    directories:='["std/json"]'

# Include hidden fixtures (discoverable=false)
LCOD_WORKSPACE_PATHS=/path/to/repo \
  lcod run --kernel rs lcod://tooling/testkit/all@0.1.0 \
    root=tests/testkit \
    directories:='["std/json","std/plan/fixtures"]' \
    includeHidden:=true
```

Hidden fixtures (such as
`tests/testkit/std/plan/fixtures/forced_failure@0.1.0`) deliberately fail so we
can assert that aggregated reports surface both successes and failures. They are
flagged with `discoverable: false` in `test.json` and only run when callers pass
`includeHidden:=true`.

An integration example lives in
`tests/testkit/std/plan/testkit_all@0.1.0`. Running the compose directly checks
that `tooling/testkit/all` reports two passes and one failure:

```bash
SPEC_REPO_PATH=/path/to/lcod-spec \
LCOD_WORKSPACE_PATHS=/path/to/lcod-components \
  lcod run --kernel rs tests/testkit/std/plan/testkit_all/compose.yaml
```
Repeat with `--kernel node` / `--kernel java` to ensure parity.

## Multi-kernel matrix

CI can now rely on a tiny shell loop instead of bespoke runners:

```bash
ROOT=/path/to/lcod-components
SPEC=/path/to/lcod-spec
REPORT_DIR="$ROOT/.lcod/testkit"
mkdir -p "$REPORT_DIR"

for kernel in rs node java; do
  LCOD_WORKSPACE_PATHS=$ROOT SPEC_REPO_PATH=$SPEC \
    lcod run --kernel "$kernel" lcod://tooling/testkit/all@0.1.0 \
      root=tests/testkit \
      planId="testkit.$kernel" \
      > "$REPORT_DIR/$kernel.json"
done

jq -s '{reports: .}' $REPORT_DIR/*.json > $REPORT_DIR/matrix.json

LCOD_WORKSPACE_PATHS=$ROOT SPEC_REPO_PATH=$SPEC \
  lcod run --kernel rs lcod://tooling/testkit/assemble@0.1.0 \
    --input $REPORT_DIR/matrix.json
```

The call to `tooling/testkit/assemble` merges the per-kernel plans into a matrix
(`kernels`, `summary`, and per-test status entries) that can be published as a
workflow artefact.

## Roadmap

- [x] Provide a CLI-friendly entrypoint `lcod://tooling/testkit/all@…` that traverses
      `tests/testkit/**`, runs each case once per kernel, and aggregates a report.
- [x] Capture regression samples (like `std/json/decode_failure`) for each package
      so we exercise nested `testkit.unit` calls.
- [ ] Teach `tooling/testkit/all@…` to orchestrate the rs/node/java kernels sequentially
      and emit a kernel × case matrix.
- [ ] Teach `scripts/run-tests.sh` (or its successor) to call the plan component
      instead of maintaining bespoke loops, then delete the bespoke runner.
