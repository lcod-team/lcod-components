<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry/source/load@0.1.0

Load registry sources from resolver configuration (paths, JSONL, inline) into normalized JSONL streams.

## Notes

Normalizes registry source declarations from the resolver configuration. It reads
packages.jsonl (and optionally registry.json) when the source points at a local
path, supports inline JSONL snippets, and aggregates the data into a structure
ready to feed `tooling/registry/index@0.1.0`.

## Behaviour

- Supports `type: path` (default), `type: jsonl`, and `type: inline`.
- For path sources, expects a root `path`, optional `packagesPath` (default
  `packages.jsonl`) and `registryPath` (default `registry.json`).
- Computes absolute paths relative to the provided `projectPath`.
- Inline JSONL content is also supported via the `jsonl` field.
- Returns the collected JSON Lines plus resolved defaults for each registry.
