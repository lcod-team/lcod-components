# lcod://tooling/registry_sources/process_pointer@0.1.0

Fetch a normalized catalogue pointer, validate the payload, and return both the
inline entry and any nested child pointers. The component also verifies optional
checksums and propagates warnings.

## Inputs

- `pointer` *(object, required)* — Normalized pointer produced by
  `normalize_pointer`.
- `downloadsRoot` *(string, required)* — Directory where HTTP/Git payloads are
  cached.
- `defaultEntrypoint` *(object, optional)* — Defaults applied when normalizing
  child pointers.
- `basePriority` *(integer, optional)* — Default priority for inherited
  pointers.

## Outputs

- `entry` *(object|null)* — Inline registry entry with component lines (null
  when no catalogue entries were produced).
- `children` *(array)* — Pointer entries to enqueue for further processing.
- `warnings` *(array)* — Warnings emitted while fetching or parsing the
  payload.
- `commit` *(string|null)* — Resolved commit for Git catalogues.
