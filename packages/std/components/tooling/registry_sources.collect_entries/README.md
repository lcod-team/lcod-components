# lcod://tooling/registry_sources/collect_entries@0.1.0

Materialise the inline registry sources defined by a `sources.json`
configuration. The component iterates over catalogue pointers, downloads or
reads their payloads (HTTP, Git or local files), validates the schema, and
emits inline source entries that can be consumed directly by the resolver.

## Inputs

- `sourcesConfig` *(object, required)* — Parsed configuration produced by
  `tooling/registry_sources/load_config`.
- `sourcesBaseDir` *(string, required)* — Base directory used to resolve
  relative catalogue pointers.
- `downloadsRoot` *(string, required)* — Directory used to store downloaded
  catalogue payloads.

## Outputs

- `registrySources` *(array)* — Inline source entries ready to be fed into the
  resolver pipeline.
- `warnings` *(array)* — Warnings emitted while downloading, parsing or
  processing catalogues.
