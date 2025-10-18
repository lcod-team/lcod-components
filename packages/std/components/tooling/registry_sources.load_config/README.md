# lcod://tooling/registry_sources/load_config@0.1.0

Load the registry `sources.json` specification, applying reasonable defaults
when the file is missing. The component resolves the effective file path,
parses the JSON payload, and reports warnings for recoverable issues.

## Inputs

- `projectRoot` *(string, required)* — Project root used to resolve relative
  paths.
- `sourcesPath` *(string, optional)* — Explicit path to `sources.json`
  (absolute or relative to the project root).
- `sourcesText` *(string, optional)* — Raw JSON text when already available.
- `defaultSourcesSpec` *(object, optional)* — Default specification returned
  when no file is found.

## Outputs

- `sourcesConfig` *(object|null)* — Parsed configuration object (null when the
  JSON payload is invalid).
- `sourcesPath` *(string)* — Effective path label (`builtin:default` when the
  fallback spec is used).
- `sourcesBaseDir` *(string)* — Directory used to resolve relative catalogue
  pointers.
- `warnings` *(array)* — Warnings emitted during loading.
- `valid` *(boolean)* — True when the configuration parsed successfully.
