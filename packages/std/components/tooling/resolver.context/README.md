<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/context/prepare@0.1.0

Prepare resolver context by normalising paths, replacement maps, and warnings.

## Notes

Normalises resolver inputs before dependency resolution:

- merges warnings coming from previous steps and registry helpers;
- ensures `projectPath`/`cacheRoot` fallback to sensible defaults;
- sanitises `sources`, `replaceAlias`, `replaceSpec` objects so downstream components can rely on plain JSON structures;
- filters the optional allowlist to string entries or returns `null` when unset.

The component is a lightweight wrapper around a single `tooling/script@1` step so that kernels can reuse the same logic without duplicating boilerplate.
