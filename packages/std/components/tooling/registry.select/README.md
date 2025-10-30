<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry/select@0.1.0

Select a registry entry matching a component id and semver range.

## Notes

Given a registry packages map (as produced by `tooling/registry/index@0.1.0`), this
component selects the best matching component entry for a requested id and
version constraint.

It understands a subset of Semantic Versioning:

- exact versions (`1.2.3`)
- caret ranges (`^1.2.0`)
- tilde ranges (`~1.4.0`)
- wildcard suffixes (`1.2.x`, `1.x`)
- `*` / `latest`
