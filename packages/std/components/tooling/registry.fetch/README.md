<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/registry/fetch@0.1.0

Download and cache registry manifests (and optional artefacts) with integrity verification.

## Notes

Downloads component manifests (and optional artefacts) from a registry, stores
them in a deterministic cache, and verifies the declared SHA-256 hashes. The
component understands HTTP and file-based registries and gracefully falls back
to existing cached copies when hashes already match.

## Behaviour

1. Compute deterministic cache paths based on `entry.id` and `entry.version`.
2. Reuse cached files when hashes match (unless `forceRefresh` is `true`).
3. Resolve manifest locations:
   - Absolute `http(s)://` / `file://` URLs are used verbatim.
   - Relative paths are resolved against `registry.url`.
4. After download, hashes are validated using `lcod://axiom/hash/sha256@1`.
5. When `entry.artifact` is present the artefact is fetched to the cache and the
   path returned alongside the manifest.

The component is pure (no kernel state mutation) so different runtimes can share
the same compose logic.
