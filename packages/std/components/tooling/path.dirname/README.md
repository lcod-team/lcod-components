# lcod://tooling/path/dirname@0.1.0

Return the parent directory of a given path. This is a lightweight wrapper
around `tooling/path/join_chain` that appends `..` to the provided path.

## Inputs

- `path` *(string, required)* — Path whose parent directory should be
  returned.

## Outputs

- `dirname` *(string)* — Parent directory.
