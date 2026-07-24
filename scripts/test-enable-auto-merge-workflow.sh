#!/usr/bin/env bash

set -euo pipefail

workflow="${1:-.github/workflows/enable-auto-merge.yml}"

line_number() {
  local pattern="$1"
  grep -n -m 1 -- "$pattern" "$workflow" | cut -d: -f1
}

merge_request_line="$(line_number 'gh pr merge "$PR_URL" --auto --merge')"
merge_poll_line="$(line_number 'for attempt in $(seq 1 60)')"
workflow_dispatch_line="$(line_number 'gh workflow run deploy-pages.yml')"
dispatch_verification_line="$(line_number 'Deployment dispatch verification')"

if (( merge_request_line >= merge_poll_line )); then
  echo "Auto-merge request must precede the bounded MERGED polling loop." >&2
  exit 1
fi

if sed -n "$((merge_request_line + 1)),$((merge_poll_line - 1))p" "$workflow" | grep -Eq '^[[:space:]]*exit 0'; then
  echo "The auto-merge path exits successfully before polling MERGED." >&2
  exit 1
fi

if (( workflow_dispatch_line >= dispatch_verification_line )); then
  echo "The workflow_dispatch request is not followed by run verification." >&2
  exit 1
fi

deploy_call_count="$(grep -Ec '^[[:space:]]+deploy_merged_commit "\$merge_sha"$' "$workflow")"
if [[ "$deploy_call_count" != "2" ]]; then
  echo "Expected exactly two guarded calls to deploy_merged_commit, found ${deploy_call_count}." >&2
  exit 1
fi

while IFS=: read -r call_line _; do
  context_start=$((call_line > 12 ? call_line - 12 : 1))
  if ! sed -n "${context_start},${call_line}p" "$workflow" | grep -Fq 'if [[ "$state" == "MERGED" ]]'; then
    echo "Deployment call on line ${call_line} is not guarded by MERGED." >&2
    exit 1
  fi
done < <(grep -n '^[[:space:]]\+deploy_merged_commit "\$merge_sha"$' "$workflow")

grep -Fq -- '--event workflow_dispatch' "$workflow"
grep -Fq -- '--commit "$merge_sha"' "$workflow"
grep -Fq 'did not reach MERGED within the 120-second polling window' "$workflow"

echo "Auto-merge workflow static checks passed."
