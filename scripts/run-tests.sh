#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/run-tests.sh [options]

Options:
  -k, --kernel <id>    Kernel to test (repeatable). Defaults: rs java
  -v, --version <ver>  Release version (e.g. 0.1.19). If omitted, uses latest release.
  -h, --help           Show this help message.

Environment:
  LCOD_RELEASE_VERSION overrides --version when set.
USAGE
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[ERROR] Missing required executable: $1" >&2
    exit 1
  fi
}

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
PROJECT_PATH="$REPO_ROOT/packages/std"
CACHE_ROOT="$REPO_ROOT/.lcod/cache"
mkdir -p "$CACHE_ROOT"

require_cmd curl
require_cmd jq
require_cmd lcod
require_cmd mktemp
require_cmd unzip

kernels=("rs" "java")
version="${LCOD_RELEASE_VERSION:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -k|--kernel)
      [[ $# -lt 2 ]] && { echo "[ERROR] --kernel requires a value" >&2; exit 1; }
      kernels=("$2")
      shift 2
      ;;
    --kernel=*)
      kernels=("${1#*=}")
      shift
      ;;
    -v|--version)
      [[ $# -lt 2 ]] && { echo "[ERROR] --version requires a value" >&2; exit 1; }
      version="$2"
      shift 2
      ;;
    --version=*)
      version="${1#*=}"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[ERROR] Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

MANIFEST_FILE=""
VERSION=""
cleanup() {
  [[ -n "$MANIFEST_FILE" && -f "$MANIFEST_FILE" ]] && rm -f "$MANIFEST_FILE"
}
trap cleanup EXIT

fetch_manifest() {
  MANIFEST_FILE=$(mktemp)
  if [[ -n "$version" ]]; then
    local tag="${version#v}"
    local url="https://github.com/lcod-team/lcod-release/releases/download/v${tag}/release-manifest.json"
    if ! curl -fsSL -H 'User-Agent: lcod-components-test-runner/1.0' "$url" -o "$MANIFEST_FILE"; then
      echo "[ERROR] Unable to download manifest for version $tag" >&2
      exit 1
    fi
    VERSION="$tag"
  else
    local latest_json
    latest_json=$(curl -fsSL -H 'User-Agent: lcod-components-test-runner/1.0' "https://api.github.com/repos/lcod-team/lcod-release/releases/latest")
    VERSION=$(echo "$latest_json" | jq -r '.tag_name' | sed 's/^v//')
    local manifest_url
    manifest_url=$(echo "$latest_json" | jq -r '.assets[] | select(.name == "release-manifest.json") | .browser_download_url')
    if [[ -z "$manifest_url" || "$manifest_url" == "null" ]]; then
      echo "[ERROR] Latest release does not expose release-manifest.json" >&2
      exit 1
    fi
    if ! curl -fsSL -H 'User-Agent: lcod-components-test-runner/1.0' "$manifest_url" -o "$MANIFEST_FILE"; then
      echo "[ERROR] Unable to download manifest from $manifest_url" >&2
      exit 1
    fi
  fi
}

resolve_spec_root() {
  local candidates=()
  [[ -n "${SPEC_REPO_PATH:-}" ]] && candidates+=("$SPEC_REPO_PATH")
  candidates+=(
    "$REPO_ROOT/../lcod-spec"
    "$REPO_ROOT/../../lcod-spec"
    "$REPO_ROOT/../spec/lcod-spec"
    "$REPO_ROOT/../../spec/lcod-spec"
  )
  for candidate in "${candidates[@]}"; do
    local dir
    dir=$(realpath "$candidate" 2>/dev/null || true)
    [[ -z "$dir" ]] && continue
    if [[ -d "$dir/tests/spec" ]]; then
      echo "$dir"
      return
    fi
  done
  echo ""
}

resolve_components_root() {
  local candidates=()
  [[ -n "${LCOD_COMPONENTS_PATH:-}" ]] && candidates+=("$LCOD_COMPONENTS_PATH")
  candidates+=(
    "$REPO_ROOT"
    "$REPO_ROOT/.."
  )
  for candidate in "${candidates[@]}"; do
    local dir
    dir=$(realpath "$candidate" 2>/dev/null || true)
    [[ -z "$dir" ]] && continue
    if [[ -d "$dir/packages" ]]; then
      echo "$dir"
      return
    fi
  done
  echo "$REPO_ROOT"
}

spec_root="$(resolve_spec_root)"
if [[ -z "$spec_root" ]]; then
  echo "[ERROR] Unable to locate lcod-spec checkout. Set SPEC_REPO_PATH." >&2
  exit 1
fi
comp_root="$(resolve_components_root)"

prepare_workspaces() {
  rm -rf "$REPO_ROOT/tests/tmp"
  mkdir -p "$REPO_ROOT/tests/tmp/workspaces"
}

get_kernel_path() {
  local kernel="$1"
  lcod kernel ls | awk -v target="$kernel" 'NR>1 && $1==target {print $3; exit}'
}

install_java_from_manifest() {
  local asset_name
  asset_name=$(jq -r '.kernels.java.assets[] | select(.name | test("^lcod-run-.*\\.jar$")) | .name' "$MANIFEST_FILE" | head -n1)
  if [[ -z "$asset_name" || "$asset_name" == "null" ]]; then
    asset_name=$(jq -r '.kernels.java.assets[] | select(.name | endswith(".jar")) | .name' "$MANIFEST_FILE" | head -n1)
  fi
  if [[ -z "$asset_name" || "$asset_name" == "null" ]]; then
    echo "[ERROR] Manifest does not list a jar asset for java kernel" >&2
    return 1
  fi
  local url
  url=$(jq -r --arg name "$asset_name" '.kernels.java.assets[] | select(.name == $name) | .download_url' "$MANIFEST_FILE")
  if [[ -z "$url" || "$url" == "null" ]]; then
    echo "[ERROR] Unable to resolve download URL for $asset_name" >&2
    return 1
  fi
  local kernel_dir="$HOME/.lcod/cache/java/${VERSION}"
  rm -rf "$kernel_dir"
  mkdir -p "$kernel_dir"
  local jar_path="$kernel_dir/$asset_name"
  echo "[INFO] Downloading $asset_name"
  curl -fsSL "$url" -o "$jar_path"
  local wrapper="$kernel_dir/lcod-kernel-java"
  cat <<EOF > "$wrapper"
#!/usr/bin/env bash
set -euo pipefail
exec java -jar "$jar_path" "\$@"
EOF
  chmod +x "$wrapper"
  lcod kernel install java --path "$wrapper" --force >/dev/null
}

install_kernel() {
  local kernel="$1"
  if [[ "$kernel" == "rs" ]]; then
    lcod kernel install rs --from-release --version "$VERSION" --force >/dev/null
  elif [[ "$kernel" == "java" ]]; then
    if ! lcod kernel install java --from-release --version "$VERSION" --force >/dev/null 2>&1; then
      install_java_from_manifest || {
        echo "[ERROR] Failed to install java kernel" >&2
        exit 1
      }
    fi
  else
    echo "[ERROR] Unsupported kernel: $kernel" >&2
    exit 1
  fi
}

probe_compose() {
  local kernel="$1"
  local bin="$2"
  local compose_content="$3"
  local input_json="$4"
  local tmp_dir
  tmp_dir=$(mktemp -d)
  local compose_file="$tmp_dir/compose.yaml"
  printf '%s
' "$compose_content" > "$compose_file"
  local output_file="$tmp_dir/output.json"
  local cache_dir="$CACHE_ROOT/$kernel"
  mkdir -p "$cache_dir"
  local cmd=("$bin" --compose "$compose_file")
  if [[ -n "$input_json" ]]; then
    cmd+=(--input "$input_json")
  fi
  if SPEC_REPO_PATH="$spec_root" LCOD_COMPONENTS_PATH="$comp_root" LCOD_CACHE_DIR="$cache_dir" "${cmd[@]}" >"$output_file" 2>/dev/null; then
    rm -rf "$tmp_dir"
    return 0
  else
    rm -rf "$tmp_dir"
    return 1
  fi
}

join_by_comma() {
  local IFS=","; echo "$*"
}

declare -A CAPABILITIES

RUN_DURATION=0

has_capability() {
  local name="$1"
  [[ -n "${CAPABILITIES[$name]+yes}" ]]
}

run_compose() {
  local kernel="$1"
  local bin="$2"
  local compose_file="$3"
  local input_file="$4"
  local output_file="$5"
  local cache_dir="$CACHE_ROOT/$kernel"
  mkdir -p "$cache_dir"
  local start_ms=$(date +%s%3N)
  local cmd=("$bin" --compose "$compose_file")
  if [[ -n "$input_file" ]]; then
    cmd+=(--input "$input_file")
  fi
  local status=0
  if ! SPEC_REPO_PATH="$spec_root" LCOD_COMPONENTS_PATH="$comp_root" LCOD_CACHE_DIR="$cache_dir" "${cmd[@]}" >"$output_file"; then
    status=$?
  fi
  local end_ms=$(date +%s%3N)
  RUN_DURATION=$(( end_ms - start_ms ))
  return $status
}

detect_capabilities() {
  local kernel="$1"
  local bin="$2"
  CAPABILITIES=()

  local register_compose
  register_compose=$(cat <<'EOF'
compose:
  - call: lcod://tooling/resolver/register@1
    in:
      components: []
EOF
)
  if probe_compose "$kernel" "$bin" "$register_compose" ""; then
    CAPABILITIES["resolver-register"]=1
    CAPABILITIES["registry-components"]=1
  else
    local registry_fixture="$REPO_ROOT/tests/fixtures/registry"
    local collect_compose
    collect_compose=$(cat <<EOF
compose:
  - call: lcod://tooling/registry_catalog/collect@0.1.0
    in:
      rootPath: "$registry_fixture"
      catalogPath: "catalog.json"
    out:
      result: $
EOF
)
    local input_file=$(mktemp)
    printf '{"projectPath":"%s"}
' "$PROJECT_PATH" > "$input_file"
    if probe_compose "$kernel" "$bin" "$collect_compose" "$input_file"; then
      CAPABILITIES["registry-components"]=1
    fi
    rm -f "$input_file"
  fi

  local toml_compose
  toml_compose=$(cat <<'EOF'
compose:
  - call: lcod://axiom/toml/parse@1
    in:
      text: "id = \"demo\""
    out:
      value: $
EOF
)
  if probe_compose "$kernel" "$bin" "$toml_compose" ""; then
    CAPABILITIES["toml-parse"]=1
  fi
}


declare -A RESULT_STATUS
declare -A RESULT_DURATION
ALL_LABELS=()
FAILURES=()

register_label() {
  local label="$1"
  for existing in "${ALL_LABELS[@]}"; do
    [[ "$existing" == "$label" ]] && return
  done
  ALL_LABELS+=("$label")
}

COMPOSE_TESTS=(
  "components.registry|tests/components.registry.yaml|project|registry-components|none"
  "components.registry.tests|tests/components.registry.tests.yaml|project|registry-components|test_checker"
  "components.std_primitives|tests/components.std_primitives.yaml|none||test_checker"
  "components.verify.metadata|tests/components.verify.metadata.yaml|project|toml-parse|none"
)

JSON_SUITES=()
collect_json_suites() {
  local suites=()
  while IFS= read -r -d '' file; do
    if jq -e '.kind == "test" and (.tests | type == "array")' "$file" >/dev/null; then
      suites+=("$file")
    fi
  done < <(find "$REPO_ROOT/packages" -path '*/tests/*.json' -type f -print0)
  JSON_SUITES=("${suites[@]}")
}

create_json_compose() {
  local test_json="$1"
  local tmp_dir
  tmp_dir=$(mktemp -d)
  local compose_path="$tmp_dir/compose.json"
  jq -n     --argjson case "$test_json"     'def maybe(k): if ($case[k] // null) == null then {} else { (k): $case[k] } end;
     {
       compose: [
         {
           call: "lcod://tooling/test_checker@1",
           in: ({
             input: ($case.input // {}),
             compose: ($case.compose // []),
             expected: ($case.expected // {})
           } + maybe("options") + maybe("before"))
         }
       ]
     }' > "$compose_path"
  echo "$compose_path"
}

check_test_checker() {
  local output_file="$1"
  jq -e '[.. | objects | select(has("success")) | select(.success == false)] | length == 0' "$output_file" >/dev/null
}

run_compose_test() {
  local kernel="$1"
  local bin="$2"
  local label="$3"
  local compose_path="$4"
  local needs_project="$5"
  local requires="$6"
  local check="$7"

  register_label "$label"

  if [[ ! -f "$compose_path" ]]; then
    echo "  - $label (missing file)"
    RESULT_STATUS["$kernel|$label"]="fail"
    FAILURES+=("[$kernel] $label missing compose file")
    return
  fi

  local missing=()
  if [[ -n "$requires" ]]; then
    IFS=',' read -ra reqs <<<"$requires"
    for req in "${reqs[@]}"; do
      if ! has_capability "$req"; then
        missing+=("$req")
      fi
    done
  fi

  if [[ ${#missing[@]} -gt 0 ]]; then
    echo "  - $label (skipped: missing $(join_by_comma "${missing[@]}") )"
    RESULT_STATUS["$kernel|$label"]="skip"
    RESULT_DURATION["$kernel|$label"]=0
    return
  fi

  local input_file=""
  if [[ "$needs_project" == "project" ]]; then
    input_file=$(mktemp)
    printf '{"projectPath":"%s"}
' "$PROJECT_PATH" > "$input_file"
  fi

  local output_file
  output_file=$(mktemp)
  if run_compose "$kernel" "$bin" "$compose_path" "$input_file" "$output_file"; then
    local status="pass"
    if [[ "$check" == "test_checker" ]]; then
      if ! check_test_checker "$output_file"; then
        status="fail"
        FAILURES+=("[$kernel] $label reported tooling/test_checker failure")
      fi
    fi
    if [[ "$status" == "pass" ]]; then
      echo "  ✓ $label (${RUN_DURATION} ms)"
      RESULT_STATUS["$kernel|$label"]="pass"
    else
      echo "  ✗ $label (tooling/test_checker failure)"
      RESULT_STATUS["$kernel|$label"]="fail"
    fi
  else
    echo "  ✗ $label (kernel exit code $?)"
    RESULT_STATUS["$kernel|$label"]="fail"
    FAILURES+=("[$kernel] $label execution failed")
  fi
  RESULT_DURATION["$kernel|$label"]=${RUN_DURATION:-0}
  rm -f "$output_file"
  if [[ -n "$input_file" ]]; then
    rm -f "$input_file"
  fi
}

run_json_suite() {
  local kernel="$1"
  local bin="$2"
  local suite_file="$3"
  local suite_id
  suite_id=$(jq -r '.id // $fallback' --arg fallback "$suite_file" "$suite_file")
  local index=0
  while IFS= read -r test_case; do
    index=$((index+1))
    local name
    name=$(echo "$test_case" | jq -r '.name // empty')
    if [[ -z "$name" ]]; then
      name="case $index"
    fi
    local label="$suite_id :: $name"
    register_label "$label"

    local compose_path
    compose_path=$(create_json_compose "$test_case")
    local input_file
    input_file=$(mktemp)
    printf '{"projectPath":"%s"}
' "$PROJECT_PATH" > "$input_file"
    local output_file
    output_file=$(mktemp)
    if run_compose "$kernel" "$bin" "$compose_path" "$input_file" "$output_file"; then
      if check_test_checker "$output_file"; then
        echo "  ✓ $label (${RUN_DURATION} ms)"
        RESULT_STATUS["$kernel|$label"]="pass"
      else
        echo "  ✗ $label (tooling/test_checker failure)"
        RESULT_STATUS["$kernel|$label"]="fail"
        FAILURES+=("[$kernel] $label reported tooling/test_checker failure")
      fi
    else
      echo "  ✗ $label (kernel exit code $?)"
      RESULT_STATUS["$kernel|$label"]="fail"
      FAILURES+=("[$kernel] $label execution failed")
    fi
    RESULT_DURATION["$kernel|$label"]=${RUN_DURATION:-0}
    rm -f "$input_file" "$output_file"
    rm -rf "$(dirname "$compose_path")"
  done < <(jq -c '.tests[]' "$suite_file")
}

print_matrix() {
  declare -A DISPLAY_NAME=( ["rs"]="rust" ["java"]="java" )
  echo
  echo "Matrix:"
  printf '|'
  for kernel in "${kernels[@]}"; do
    printf ' %s |' "${DISPLAY_NAME[$kernel]:-$kernel}"
  done
  echo ' test |'
  printf '|'
  for _ in "${kernels[@]}"; do
    printf ' --- |'
  done
  echo ' --- |'
  for label in "${ALL_LABELS[@]}"; do
    printf '|'
    for kernel in "${kernels[@]}"; do
      local key="${kernel}|${label}"
      local status="${RESULT_STATUS[$key]:-skip}"
      local duration="${RESULT_DURATION[$key]:-0}"
      local cell
      case "$status" in
        pass)
          if [[ "$duration" -gt 0 ]]; then
            cell="✓ ${duration} ms"
          else
            cell="✓"
          fi
          ;;
        fail)
          if [[ "$duration" -gt 0 ]]; then
            cell="✗ ${duration} ms"
          else
            cell="✗"
          fi
          ;;
        *)
          cell="–"
          ;;
      esac
      printf ' %s |' "$cell"
    done
    printf ' %s |
' "$label"
  done
}

report_failures() {
  if [[ ${#FAILURES[@]} -gt 0 ]]; then
    echo
    echo "Test failures detected:" >&2
    for failure in "${FAILURES[@]}"; do
      echo "- $failure" >&2
    done
    exit 1
  fi
}

fetch_manifest
prepare_workspaces
collect_json_suites

for kernel in "${kernels[@]}"; do
  install_kernel "$kernel"
  bin_path=$(get_kernel_path "$kernel")
  if [[ -z "$bin_path" ]]; then
    echo "[ERROR] Unable to locate binary for kernel $kernel" >&2
    exit 1
  fi
  bin_path=$(realpath "$bin_path")
  printf '
=== Running tests with kernel '''%s''' ===
' "$kernel"
  detect_capabilities "$kernel" "$bin_path"
  if [[ ${#CAPABILITIES[@]} -gt 0 ]]; then
    printf '  capabilities: %s
' "$(printf '%s ' "${!CAPABILITIES[@]}" | sed 's/ $//')"
  else
    echo "  capabilities: none detected"
  fi

  for entry in "${COMPOSE_TESTS[@]}"; do
    IFS='|' read -r label file needs_project requires check <<<"$entry"
    run_compose_test "$kernel" "$bin_path" "$label" "$REPO_ROOT/$file" "$needs_project" "$requires" "$check"
  done

  if [[ ${#JSON_SUITES[@]} -gt 0 ]]; then
    for suite_file in "${JSON_SUITES[@]}"; do
      run_json_suite "$kernel" "$bin_path" "$suite_file"
    done
  fi
done

if [[ ${#ALL_LABELS[@]} -gt 0 ]]; then
  print_matrix
fi

report_failures
