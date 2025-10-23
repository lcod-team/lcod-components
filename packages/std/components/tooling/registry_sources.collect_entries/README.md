<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:cloud-download.svg?height=48&width=48" alt="Fetch registry catalogues from the sources configuration and emit inline registry source entries." width="48" height="48" /></p>

# lcod://tooling/registry_sources/collect_entries@0.1.0

Fetch registry catalogues from the sources configuration and emit inline registry source entries.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sourcesConfig` | object | Yes | Parsed sources specification. |
| `sourcesBaseDir` | string | Yes | Base directory used to resolve relative catalogue paths. |
| `downloadsRoot` | string | Yes | Directory dedicated to downloaded catalogues. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `registrySources` | array | Inline registry source entries derived from the catalogues. |
| `warnings` | array | Warnings emitted while fetching and parsing catalogues. |

## Notes

Materialise the inline registry sources defined by a `sources.json`
configuration. The component iterates over catalogue pointers, downloads or
reads their payloads (HTTP, Git or local files), validates the schema, and
emits inline source entries that can be consumed directly by the resolver.
