<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry_sources/process_catalogue@0.1.0

Analyse a resolved catalogue payload and emit inline component entries.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `catalogue` | object | Yes | Parsed catalogue JSON. |
| `pointer` | object | Yes | Normalized pointer currently processed. |
| `basePriority` | integer | No | Default priority inherited from sources defaults. |
| `baseDir` | string | Yes | Base directory of the current payload (used for file origins). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `entry` | object | Inline registry entry (id, priority, defaults, metadata, lines). |
| `warnings` | array | Warnings emitted while processing the catalogue. |

## Notes

Transform a parsed registry catalogue into inline component entries. The component infers defaults from the catalogue origin, applies priority rules, and returns the lines to inject into the accumulator used by the resolver.
