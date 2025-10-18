# lcod://tooling/registry_sources/normalize_pointer@0.1.0

Merge the defaults defined in sources.json (priority, entrypoint overrides) with a pointer entry to produce a normalized catalogue pointer.

The component applies inheritance rules, resolves the base directory, and validates that required properties are present. Invalid entries return null together with warning messages.

## Inputs

- entry *(object, optional)* — Raw pointer entry from sources.json.
- inherited *(object, optional)* — Pointer inherited from a parent catalogue.
- baseDir *(string, optional)* — Base directory override for nested catalogues.
- sourcesBaseDir *(string, required)* — Base directory for top-level sources.
- defaultEntrypoint *(object, optional)* — Default entrypoint definition from sources.defaults.entrypoint.
- basePriority *(integer, optional)* — Default priority from sources.defaults.priority.

## Outputs

- pointer *(object|null)* — Normalized pointer or null when invalid.
- warnings *(array)* — Warnings emitted during normalization.

