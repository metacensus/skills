#!/usr/bin/env bash
# Fixes what a repository admin can; prints TODO for the rest and exits 1.
set -euo pipefail

repo=${1:?usage: sdlc-setup.sh OWNER/REPO [PATH | OWNER/NAME:PATH]}
owner=${repo%%/*}
hub=$(dirname "$0")/../skills/sdlc
parse=$(dirname "$0")/mapping.mts
todo=0

case ${2-} in
'') mapping= ;;
*:*) mapping=$(gh api -H 'Accept: application/vnd.github.raw' "repos/${2%%:*}/contents/${2#*:}") ;;
*) mapping=$(<"$2") ;;
esac

merged() {
  local stated key rest
  stated=$(node "$parse" "$1" <<<"$mapping")
  [[ -z $stated ]] || echo "$stated"
  while IFS=$'\t' read -r key rest; do
    case $'\n'$stated in *$'\n'"$key"$'\t'*) ;; *) printf '%s\t%s\t%s\n' "$key" "$key" "$rest" ;; esac
  done
}

node "$parse" --holes <<<"$mapping" | sed 's/^/ok    Hole, so its default holds: /'

gh api -X PATCH "repos/$repo" -F has_issues=true --silent
echo "ok    issues on"
[[ $(gh api "repos/$repo" --jq .visibility) == public ]] || echo "ok    $repo is private, so forms cannot require fields; curation does"

labels=$(gh label list -R "$repo" -L 1000 --json name,color,description --jq '.[] | [.name, .color, .description] | @tsv')
named=
while IFS=$'\t' read -r role label description; do
  case $role in
  ready) color=0e8a16 ;;
  designed) color=1d76db ;;
  deviated) color=fbca04 ;;
  reached-up) color=c5def5 ;;
  *) color=ededed ;;
  esac
  named+=$label$'\n'
  grep -qxF "$label"$'\t'"$color"$'\t'"$description" <<<"$labels" ||
    gh label create "$label" -R "$repo" --color "$color" --description "$description" --force >/dev/null
  echo "ok    label $label"
done < <(printf '%s\t%s\n' \
  ready 'Meets its form; may be picked up' \
  designed 'A person can read the issue alone and know what will be built' \
  deviated 'Done differently than planned; see the closing comment' \
  reached-up 'Its work rewrote the parent' | merged Labels)
while IFS=$'\t' read -r label _; do
  [[ -z $label ]] || grep -qxF "$label" <<<"$named" ||
    { echo "TODO  label $label: no role names it; delete it, or give it a role in the mapping"; todo=1; }
done <<<"$labels"

boards=$(node "$parse" Boards <<<"$mapping" | cut -f1)
[[ $boards ]] || echo "ok    no board"
views=('Issues type:Task,Bug' 'Epics type:Epic' 'Initiatives type:Initiative')
for board in $boards; do
  if ! [[ $board =~ ^([^/]+)/([0-9]+)$ ]]; then
    echo "TODO  board $board is not OWNER/N"
    todo=1
  elif columns=$(gh project field-list "${BASH_REMATCH[2]}" --owner "${BASH_REMATCH[1]}" --format json \
    --jq '.fields[] | select(.name == "Status") | .options[].name'); then
    while IFS=$'\t' read -r status column _; do
      [[ $column == — ]] && { echo "ok    no column for $status"; continue; }
      grep -qxF "$column" <<<"$columns" || { echo "TODO  board $board has no column $column"; todo=1; }
    done < <(node "$parse" Status "$hub/SKILL.md" | merged Status)
    project=$(gh api graphql -F o="${BASH_REMATCH[1]}" -F n="${BASH_REMATCH[2]}" -f query='query($o:String!,$n:Int!){repositoryOwner(login:$o){... on ProjectV2Owner{projectV2(number:$n){id
      views(first:50){nodes{name groupByFields(first:1){nodes{... on ProjectV2FieldCommon{name}}}}}
      workflows(first:20){nodes{name enabled}}}}}}' --jq .data.repositoryOwner.projectV2)
    jq -r --args '.views.nodes[].name | select(IN($ARGS.positional[]) | not)' "${views[@]%% *}" <<<"$project" |
      while IFS= read -r name; do echo "note  board $board view $name: not one of Setup's three; left as set"; done
    for view in "${views[@]}"; do
      name=${view%% *}
      if ! jq -e --arg n "$name" '.views.nodes[] | select(.name == $n)' <<<"$project" >/dev/null; then
        if ! id=$(gh api graphql -F p="$(jq -r .id <<<"$project")" -F n="$name" -f query='mutation($p:ID!,$n:String!){createProjectV2View(input:{projectId:$p,name:$n,layout:BOARD_LAYOUT}){projectV2View{id}}}' --jq .data.createProjectV2View.projectV2View.id); then
          echo "TODO  board $board view $name: cannot create it; lacking the project scope, gh auth refresh -s project"
          todo=1
          continue
        fi
        if gh api graphql -F v="$id" -F f="${view#* }" -f query='mutation($v:ID!,$f:String!){updateProjectV2View(input:{viewId:$v,filter:$f}){clientMutationId}}' --silent; then
          echo "ok    board $board view $name"
        else
          echo "TODO  board $board view $name: set its filter to ${view#* }"
          todo=1
        fi
      fi
      jq -e --arg n "$name" '.views.nodes[] | select(.name == $n) | .groupByFields.nodes[] | select(.name == "Priority")' <<<"$project" >/dev/null ||
        { echo "TODO  board $board view $name: Group by Priority, then Save"; todo=1; }
    done
    jq -e '.workflows.nodes[] | select(.name == "Auto-add sub-issues to project" and .enabled)' <<<"$project" >/dev/null ||
      { echo "TODO  board $board: enable the Auto-add sub-issues to project workflow"; todo=1; }
    echo "note  board $board: auto-archive closed items in Settings → Workflows; the API cannot read it"
  else
    echo "TODO  cannot read board $board; lacking the project scope, gh auth refresh -s project"
    todo=1
  fi
done
for o in $(sed -n 's|^\([^/]*\)/[0-9][0-9]*$|\1|p' <<<"$boards" | sort -u); do
  if numbers=$(gh project list --owner "$o" -L 1000 --format json --jq '.projects[].number'); then
    for n in $numbers; do
      grep -qxF "$o/$n" <<<"$boards" ||
        { echo "TODO  board $o/$n: no Boards row names it; close it, or give it a row in the mapping"; todo=1; }
    done
  else
    echo "TODO  cannot list $o's boards; lacking the project scope, gh auth refresh -s project"
    todo=1
  fi
done

if types=$(gh api "orgs/$owner/issue-types" --jq '.[] | select(.is_enabled) | .name' 2>/dev/null); then
  for want in Initiative Epic Task Bug; do
    grep -qx "$want" <<<"$types" || { echo "TODO  org issue type $want is missing"; todo=1; }
  done
  while read -r have; do
    case $have in Initiative | Epic | Task | Bug) ;; *) echo "TODO  org issue type $have is not in the ladder; retire it"; todo=1 ;; esac
  done <<<"$types"
elif [[ $(gh api "users/$owner" --jq .type) == User ]]; then
  echo "ok    $owner is not an organization; titles state the type"
else
  echo "TODO  cannot read $owner's issue types; lacking the read:org scope, gh auth refresh -s read:org"
  todo=1
fi

# The type each form in $1's .github/ISSUE_TEMPLATE sets, one per line.
form_types() {
  local file
  while read -r file; do
    gh api -H 'Accept: application/vnd.github.raw' "repos/$1/contents/.github/ISSUE_TEMPLATE/$file" |
      sed -n 's/^type:[[:space:]]*["'"'"']\{0,1\}\([A-Za-z]*\).*/\1/p'
  done < <(gh api "repos/$1/contents/.github/ISSUE_TEMPLATE" --jq '.[] | select(.name | test("[.]ya?ml$")) | .name')
}

if gh api "repos/$repo/contents/.github/ISSUE_TEMPLATE" --silent 2>/dev/null; then
  where=$repo note="shadowing any the organization sets"
elif [[ $(gh api "repos/$owner/.github" --jq .visibility 2>/dev/null) == public ]] &&
  gh api "repos/$owner/.github/contents/.github/ISSUE_TEMPLATE" --silent 2>/dev/null; then
  where=$owner/.github note="inherited by $repo"
else
  where=
  echo "TODO  no forms; copy $hub/forms/ ($(cd "$hub/forms" && echo *.yml)) to .github/ISSUE_TEMPLATE/ in $owner/.github, a public repository"
  todo=1
fi
if [[ $where ]]; then
  have=$(form_types "$where")
  lacking=
  for want in $(sed -n 's/^type:[[:space:]]*//p' "$hub"/forms/*.yml | sort -u); do
    grep -qx "$want" <<<"$have" && continue
    echo "TODO  forms in $where lack a form of type $want; copy one from $hub/forms/ to its .github/ISSUE_TEMPLATE/"
    lacking=1 todo=1
  done
  [[ $lacking ]] || echo "ok    forms in $where, $note"
fi

exit $todo
