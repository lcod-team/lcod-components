<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry/index@0.1.0

Parse registry JSONL streams and produce ordered package indices.

## Notes

Builds an ordered in-memory catalogue from one or more `packages.jsonl` streams.
Each stream corresponds to a registry (or a local override file) and may define:

- `{"kind":"registry", …}` lines that describe chained registries.
- `{"kind":"component", …}` lines that reference published component versions.

The component normalises all entries, attaches priority/order metadata, and
groups versions per component so resolvers can pick the newest compatible one.

## Behaviour

- Streams are processed in the given order. Lower `priority` wins; ties fall back
  to the declaration order of the JSON lines.
- `kind="registry"` entries are deduplicated by `id` (first occurrence wins) and
  inherit defaults provided alongside the stream (type, URL, priority).
- `kind="component"` entries inherit the stream `registryId` and may carry extra
  metadata (e.g. `artifact`). The component map groups versions sorted by
  `(priority, order)` so the resolver can do “first match wins” while honouring
  the original JSONL ordering.
- Blank lines or invalid JSON lines are ignored but reported in the `errors`
  output to aid debugging.

## Notes

- The component does not fetch remote files; callers must supply the JSONL
  content (from HTTP, Git, etc.) and any pre-parsed overrides.
- The resolver may concatenate multiple outputs (e.g. local overrides + official)
  by merging `registries`, concatenating `entries`, and merging `packages`.
