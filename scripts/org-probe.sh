#!/usr/bin/env bash
# Runs one read-only probe per repository, $repo set to OWNER/REPO; prints conforms or departs for each, exits 1 when any departs.
set -euo pipefail

targets=()
while (($#)) && [[ $1 != -- ]]; do targets+=("$1"); shift; done
(($# == 2 && ${#targets[@]})) || { echo 'usage: org-probe.sh OWNER|OWNER/REPO... -- COMMAND' >&2; exit 2; }

repos=
for target in "${targets[@]}"; do
  case $target in
  */*) repos+=$target$'\n' ;;
  *) repos+=$(gh repo list "$target" --no-archived --source -L 1000 --json nameWithOwner --jq '.[].nameWithOwner')$'\n' ;;
  esac
done

departs=0
while read -r repo; do
  [[ $repo ]] || continue
  if repo=$repo bash -c "$2" >/dev/null 2>&1 </dev/null; then
    printf 'conforms\t%s\n' "$repo"
  else
    printf 'departs\t%s\n' "$repo"
    departs=1
  fi
done <<<"$repos"
exit $departs
