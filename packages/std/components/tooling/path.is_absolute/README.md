<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:sign-direction.svg?height=48&width=48" alt="Check whether a path is absolute." width="48" height="48" /></p>

# lcod://tooling/path/is_absolute@0.1.0

Check whether a path is absolute.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | No | Path to analyse. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `absolute` | boolean | True when the provided path is absolute. |

## Notes

Detect whether a path is absolute. Supports Unix-style absolute paths and
Windows drive-prefixed paths.
