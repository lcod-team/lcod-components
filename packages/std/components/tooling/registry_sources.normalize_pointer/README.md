<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_sources/normalize_pointer@0.1.0

Merge pointer defaults and entry overrides to produce a normalized catalogue pointer.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `entry` | object | No | Raw pointer entry from sources.json. |
| `inherited` | object | No | Pointer inherited from parent catalogue. |
| `baseDir` | string | No | Base directory used to resolve relative entry paths. |
| `sourcesBaseDir` | string | Yes | Default base directory for top-level sources. |
| `defaultEntrypoint` | object | No | Entrypoint defaults taken from sources.defaults.entrypoint. |
| `basePriority` | integer | No | Default priority inherited from sources.defaults.priority. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `pointer` | object | Normalized pointer (null when entry is invalid). |
| `warnings` | array | Warnings produced during normalization. |

## Notes

Merge the defaults defined in sources.json (priority, entrypoint overrides) with a pointer entry to produce a normalized catalogue pointer.

The component applies inheritance rules, resolves the base directory, and validates that required properties are present. Invalid entries return null together with warning messages.
