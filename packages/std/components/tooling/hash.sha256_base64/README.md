<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:lock.svg?height=48&width=48" alt="Compute a SHA-256 checksum and return it in base64 format." width="48" height="48" /></p>

# lcod://tooling/hash/sha256_base64@0.1.0

Compute a SHA-256 checksum and return it in base64 format.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | No | Input data (UTF-8 string). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `hex` | string | SHA-256 digest in hexadecimal (lowercase). |
| `base64` | string | SHA-256 digest encoded in base64. |

## Notes

Compute a SHA-256 checksum for a UTF-8 string and expose both the hexadecimal
and base64 representations.
