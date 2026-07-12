#!/usr/bin/env bash
set -euo pipefail

preview_user="${PREVIEW_USER:-}"
preview_host="${PREVIEW_HOST:-}"
preview_port="${PREVIEW_PORT:-}"
preview_path="${PREVIEW_PATH:-}"
preview_ssh_key="${PREVIEW_SSH_KEY:-}"
preview_known_hosts="${PREVIEW_KNOWN_HOSTS:-}"

fail() {
  echo "::error::$1" >&2
  exit 1
}

contains_control_tab_newline_or_space() {
  local value="$1"
  [[ "$value" == *$'\n'* || "$value" == *$'\r'* || "$value" == *$'\t'* || "$value" == *' '* ]] && return 0
  LC_ALL=C [[ "$value" == *[$'\001'-$'\010'$'\013'$'\014'$'\016'-$'\037'$'\177']* ]]
}

contains_control_tab_or_newline() {
  local value="$1"
  [[ "$value" == *$'\n'* || "$value" == *$'\r'* || "$value" == *$'\t'* ]] && return 0
  LC_ALL=C [[ "$value" == *[$'\001'-$'\010'$'\013'$'\014'$'\016'-$'\037'$'\177']* ]]
}

if [[ -z "$preview_user" ]]; then
  fail "PREVIEW_USER must not be empty."
fi
if contains_control_tab_or_newline "$preview_user"; then
  fail "PREVIEW_USER must not contain control characters, tabs, or newlines."
fi
if [[ ! "$preview_user" =~ ^[a-z_][a-z0-9_-]{0,31}(\$)?$ ]]; then
  fail "PREVIEW_USER must be a valid Unix-like user name."
fi

if [[ -z "$preview_ssh_key" ]]; then
  fail "PREVIEW_SSH_KEY must not be empty."
fi
if [[ -z "$preview_known_hosts" ]]; then
  fail "PREVIEW_KNOWN_HOSTS must not be empty."
fi
if contains_control_tab_or_newline "$preview_known_hosts"; then
  fail "PREVIEW_KNOWN_HOSTS must not contain control characters, tabs, or newlines."
fi

if [[ -z "$preview_host" ]]; then
  fail "PREVIEW_HOST must not be empty."
fi
if [[ "$preview_host" == -* ]]; then
  fail "PREVIEW_HOST must not start with '-'."
fi
if contains_control_tab_newline_or_space "$preview_host"; then
  fail "PREVIEW_HOST must not contain spaces, control characters, tabs, or newlines."
fi

if [[ -z "$preview_port" ]]; then
  fail "PREVIEW_PORT must not be empty."
fi
if [[ ! "$preview_port" =~ ^[0-9]+$ ]] || (( 10#$preview_port < 1 || 10#$preview_port > 65535 )); then
  fail "PREVIEW_PORT must be an integer between 1 and 65535."
fi

if [[ -z "$preview_path" ]]; then
  fail "PREVIEW_PATH must not be empty."
fi
if contains_control_tab_newline_or_space "$preview_path"; then
  fail "PREVIEW_PATH must not contain spaces, control characters, tabs, or newlines."
fi
if [[ ! "$preview_path" =~ ^[A-Za-z0-9._/-]+$ ]]; then
  fail "PREVIEW_PATH contains unsupported characters."
fi
if [[ "$preview_path" != /* ]]; then
  fail "PREVIEW_PATH must be absolute."
fi
if [[ "$preview_path" == "/" || "$preview_path" == "/var" || "$preview_path" == "/var/www" ]]; then
  fail "PREVIEW_PATH must be located below /var/www/."
fi
case "$preview_path" in
  /var/www/*) ;;
  *) fail "PREVIEW_PATH must be located below /var/www/." ;;
esac
case "/${preview_path#/}/" in
  */../*|*/./*) fail "PREVIEW_PATH must not contain . or .. path components." ;;
esac
