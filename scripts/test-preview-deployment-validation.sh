#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
validator="${script_dir}/validate-preview-deployment.sh"

run_case() {
  local expected="$1" path="$2" port="$3"
  set +e
  PREVIEW_USER="preview" PREVIEW_HOST="preview.example.com" PREVIEW_PORT="$port" PREVIEW_PATH="$path" PREVIEW_SSH_KEY="test-key" PREVIEW_KNOWN_HOSTS="preview.example.com ssh-ed25519 AAAATEST" "$validator" >/tmp/preview-validation.out 2>/tmp/preview-validation.err
  local status=$?
  set -e
  if [[ "$expected" == "pass" && $status -ne 0 ]]; then
    echo "Expected pass for path='$path' port='$port'" >&2
    cat /tmp/preview-validation.err >&2
    exit 1
  fi
  if [[ "$expected" == "fail" && $status -eq 0 ]]; then
    echo "Expected failure for path='$path' port='$port'" >&2
    exit 1
  fi
}

run_case pass "/var/www/roue-libre-preview" "22"
run_case pass "/var/www/previews/roue-libre" "65535"

for path in \
  "/" \
  "/var" \
  "/var/www" \
  "relative/path" \
  "/tmp/preview" \
  "/tmp/../.." \
  "/var/www/roue-libre-preview/../../.." \
  "/var/www/../root"; do
  run_case fail "$path" "22"
done

for port in "0" "65536" "not-a-number"; do
  run_case fail "/var/www/roue-libre-preview" "$port"
done
