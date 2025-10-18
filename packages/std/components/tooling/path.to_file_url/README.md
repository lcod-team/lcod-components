# lcod://tooling/path/to_file_url@0.1.0

Convert an absolute filesystem path into a normalised `file://` URL. Backslashes
are replaced by forward slashes and redundant `./` segments are removed.

## Inputs

- `path` *(string, optional)* — Filesystem path to convert.

## Outputs

- `url` *(string)* — Normalised `file://` URL, or `null` when the input is
  empty.
