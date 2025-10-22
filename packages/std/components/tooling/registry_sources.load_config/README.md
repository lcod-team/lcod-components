<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_sources/load_config@0.1.0

Load and parse the registry sources specification, applying default fallbacks when the file is missing.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectRoot` | string | Yes | Resolved project root directory. |
| `sourcesPath` | string | No | Optional explicit path to sources.json (absolute or relative to project). |
| `sourcesText` | string | No | Raw JSON text when the caller already loaded the sources file. |
| `defaultSourcesSpec` | object | No | Built-in sources specification used when the file is missing. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `sourcesConfig` | object | Parsed sources configuration (null when invalid). |
| `sourcesPath` | string | Effective path label for the sources configuration (file path or builtin label). |
| `sourcesBaseDir` | string | Directory used to resolve relative catalogue pointers. |
| `warnings` | array | Warnings emitted while loading/reading the configuration. |
| `valid` | boolean | Indicates whether the configuration was parsed successfully. |

## Notes

Load the registry `sources.json` specification, applying reasonable defaults
when the file is missing. The component resolves the effective file path,
parses the JSON payload, and reports warnings for recoverable issues.
