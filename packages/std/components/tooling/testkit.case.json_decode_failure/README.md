<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/testkit.case/json_decode_failure@0.1.0

Regression guard ensuring tooling/json/decode_object mismatches are detected.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | any | No | JSON text to decode (defaults to '{"success":true}'). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `result` | any | Test report produced by testkit/unit. |
