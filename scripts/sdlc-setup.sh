#!/usr/bin/env bash
# Fixes what a repository admin can; prints TODO for the rest and exits 1.
set -euo pipefail

repo=${1:?usage: sdlc-setup.sh OWNER/REPO [PATH | OWNER/NAME:PATH]}
owner=${repo%%/*}
hub=$(dirname "$0")/../skills/sdlc
todo=0

case ${2-} in
'') mapping= ;;
*:*) mapping=$(gh api -H 'Accept: application/vnd.github.raw' "repos/${2%%:*}/contents/${2#*:}") ;;
*) mapping=$(<"$2") ;;
esac

# Body rows of stdin's `## $1` table, tab-separated, backticks stripped.
rows() {
  local line section= body= cell cells row
  while IFS= read -r line; do
    case $line in
    '## '*) section=${line#'## '} body= ;;
    '|'*)
      [[ $section == "$1" ]] || continue
      [[ $line =~ ^[-|:\ ]+$ ]] && { body=1; continue; }
      [[ $body ]] || continue
      line=${line//\`/}
      IFS='|' read -ra cells <<<"${line#|}"
      row=
      for cell in "${cells[@]}"; do
        read -r cell <<<"$cell"
        row+=$cell$'\t'
      done
      echo "${row%$'\t'}"
      ;;
    esac
  done
}

merged() {
  local stated key rest
  stated=$(rows "$1" <<<"$mapping" | grep -v Hole || true)
  [[ -z $stated ]] || echo "$stated"
  while IFS=$'\t' read -r key rest; do
    case $'\n'$stated in *$'\n'"$key"$'\t'*) ;; *) printf '%s\t%s\t%s\n' "$key" "$key" "$rest" ;; esac
  done
}

grep '^|.*Hole' <<<"$mapping" | sed 's/^/ok    Hole, so its default holds: /' || true

gh api -X PATCH "repos/$repo" -F has_issues=true --silent
echo "ok    issues on"
[[ $(gh api "repos/$repo" --jq .visibility) == public ]] || echo "ok    $repo is private, so forms cannot require fields; curation does"

while IFS=$'\t' read -r role label description; do
  case $role in
  ready) color=0e8a16 ;;
  designed) color=1d76db ;;
  deviated) color=fbca04 ;;
  reached-up) color=c5def5 ;;
  *) color=ededed ;;
  esac
  gh label create "$label" -R "$repo" --color "$color" --description "$description" --force >/dev/null
  echo "ok    label $label"
done < <(printf '%s\t%s\n' \
  ready 'Meets its form; may be picked up' \
  designed 'Design stage passed' \
  deviated 'Done differently than planned; see the closing comment' \
  reached-up 'Its work rewrote the parent' | merged Labels)

boards=$(rows Repositories <<<"$mapping" | grep -v Hole | grep "^$repo"$'\t' | cut -f2 || true)
[[ $boards == — ]] && boards=
[[ $boards ]] || echo "ok    no board"
for board in $boards; do
  if ! [[ $board =~ ^([^/]+)/([0-9]+)$ ]]; then
    echo "TODO  board $board is not OWNER/N"
    todo=1
  elif columns=$(gh project field-list "${BASH_REMATCH[2]}" --owner "${BASH_REMATCH[1]}" --format json \
    --jq '.fields[] | select(.name == "Status") | .options[].name'); then
    while IFS=$'\t' read -r status column _; do
      [[ $column == — ]] && { echo "ok    no column for $status"; continue; }
      grep -qxF "$column" <<<"$columns" || { echo "TODO  board $board has no column $column"; todo=1; }
    done < <(rows Status <"$hub/SKILL.md" | merged Status)
  else
    echo "TODO  cannot read board $board; gh auth refresh -s read:project"
    todo=1
  fi
done

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
  echo "TODO  no forms; copy $hub/forms/ to .github/ISSUE_TEMPLATE/ in $owner/.github, a public repository"
  todo=1
fi

exit $todo
