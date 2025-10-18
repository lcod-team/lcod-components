# lcod://tooling/registry_sources/process_catalogue@0.1.0

Transform a parsed registry catalogue into inline component entries. The component infers defaults from the catalogue origin, applies priority rules, and returns the lines to inject into the accumulator used by the resolver.

## Inputs

- `catalogue` *(object, required)* — Parsed catalogue object (schema `lcod-registry/catalogue@1`).
- `pointer` *(object, required)* — Normalized pointer currently processed.
- `basePriority` *(integer, optional)* — Default priority inherited from top-level sources.
- `baseDir` *(string, required)* — Base directory for resolving local origins.

## Outputs

- `entry` *(object|null)* — Inline registry entry with `{ id, priority, defaults, metadata, lines }` or `null` when nothing was produced.
- `warnings` *(array)* — Warnings emitted during processing.
