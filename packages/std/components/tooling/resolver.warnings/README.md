<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/warnings/merge@0.1.0

Flatten multiple warning arrays into a single list.

## Notes

Simple utility to merge warning arrays from different resolver stages. Each non-empty string from the provided buckets is appended to the result, preserving order. Non-array buckets and falsy entries are ignored.
