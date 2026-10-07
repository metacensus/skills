#!/usr/bin/env bash
# Fixes what a repository admin can; prints TODO for the rest and exits 1.
set -euo pipefail

repo=${1:?usage: issues-setup.sh OWNER/REPO}
owner=${repo%%/*}
todo=0

gh api -X PATCH "repos/$repo" -F has_issues=true --silent
echo "ok    issues on"

while IFS=' ' read -r label color description; do
  gh label create "$label" -R "$repo" --color "$color" --description "$description" --force >/dev/null
  echo "ok    label $label"
done <<'LABELS'
needs-triage d93f0b Filed; not yet checked against its form
agent-ready 0e8a16 Triaged; may be picked up
deviated fbca04 Done differently than planned; see the closing comment
reached-up c5def5 Its work rewrote the parent
LABELS

if types=$(gh api "orgs/$owner/issue-types" --jq '.[].name' 2>/dev/null); then
  for want in Epic Task Bug; do
    grep -qx "$want" <<<"$types" || { echo "TODO  org issue type $want is missing"; todo=1; }
  done
  while read -r have; do
    case $have in Epic | Task | Bug) ;; *) echo "TODO  org issue type $have is not in the ladder; retire it"; todo=1 ;; esac
  done <<<"$types"
elif [[ $(gh api "users/$owner" --jq .type) == User ]]; then
  echo "ok    $owner is not an organization; titles state the type"
else
  echo "TODO  cannot read $owner's issue types"
  todo=1
fi

if gh api "repos/$repo/contents/.github/ISSUE_TEMPLATE" --silent 2>/dev/null; then
  echo "ok    forms in $repo, shadowing any the organization sets"
elif [[ $(gh api "repos/$owner/.github" --jq .visibility 2>/dev/null) == public ]] &&
  gh api "repos/$owner/.github/contents/.github/ISSUE_TEMPLATE" --silent 2>/dev/null; then
  echo "ok    forms inherited from $owner/.github"
else
  echo "TODO  no forms; copy $(dirname "$0")/../skills/issues/forms/ to .github/ISSUE_TEMPLATE/ in $owner/.github, a public repository"
  todo=1
fi

exit $todo
