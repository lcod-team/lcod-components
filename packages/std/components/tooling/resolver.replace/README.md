<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/replace/apply@0.1.0

Compute the final component id after applying resolver replacement rules.

## Notes

Utility component that resolves the effective component identifier according to the resolver configuration:

- walks the `replaceAlias` map until it finds a terminal id or encounters a cycle;
- if a specific override is present in `replaceSpec`, returns it alongside the resolved id;
- reports misconfigurations (missing id, alias cycles) through the accumulated warnings.

This helper keeps the replacement logic reusable across resolver flows and easy to unit test.
