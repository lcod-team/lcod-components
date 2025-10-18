# lcod://tooling/path/join_chain@0.1.0

Join a base path with an ordered list of segments. Null or empty segments are
skipped, and intermediate joins delegate to the standard `path/join` axiom.

## Inputs

- `base` *(string, optional)* — Starting path. Defaults to an empty string.
- `segments` *(array, optional)* — Segments to append sequentially.

## Outputs

- `path` *(string)* — The resulting joined path.
