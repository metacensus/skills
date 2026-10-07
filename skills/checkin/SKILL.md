---
name: checkin
description: Pre-flight checks before putting anything back into a shared repository. Trigger before any commit, push, or pull request, and whenever the user says they want to check something in, commit, push, open a PR, or "put this back".
---

A sloppy check-in rarely breaks the build — the gate catches that. It causes **structural drift**: a diff that reformats a file, duplicates derived state, or invents a convention that already existed, and the cost lands on whoever maintains the repository next.

## 1. Branch — never the default branch

If `git rev-parse --abbrev-ref HEAD` names the default branch, branch first. Name the branch **`<your-name>/<topic>`**, `alex/retry-backoff`: the owner prefix says whom to ask about a stale branch, and the topic names the change's subject rather than a ticket or the tool that made it. Rename (`git branch -m`) a branch off that shape before pushing.

## 2. Match precedent before you invent

The highest-value habit. Before writing a new record, field, or file, find two or three siblings that solved the same problem and copy their exact shape, key by key. If yours differs from every precedent, change yours: schema-valid is not conventional.

## 3. Never author derived state

What the system computes — counts, indices, lists of contents, claims over a set — is not written. Nor is a fact a later edit would falsify: "the first X in Y" is a count, false the moment a second lands, and a date restated in prose goes stale beside the field that holds it. Write each fact once, in its field, in the present tense.

## 4. Check what else your edit made false

Changing one record can falsify prose on a sibling while every check passes. After an edit, grep for whatever else references the same entity and re-read it against your change.

## 5. Keep the diff surgical

Change the lines the change needs and no others. Never reformat or re-serialize a whole file to change a few lines; if an editor or script rewrites encoding, line endings, or order, restore them before committing.

A pull request that proposes edits to someone else's branch carries the proposal and nothing else: base it wherever its diff is smallest — the default branch, when no edit depends on their work — and when their branch is stale, offer the rebase as a branch of its own. Feedback on their work goes in their pull request's thread.

## 6. Run the gate

Run the repository's gate locally even when CI repeats it: finding the break before the push is the point. Where the gate validates content, a failure names the rule it holds; read that rule before working around it.

## 7. Ask what settles what you altered

Where the repository has an `elegance-mapping.md`, `node ${CLAUDE_PLUGIN_ROOT}/scripts/check-cells.mts --diff` maps changed paths to the review they need; run it and do what it prints, even when sure. It is computed from paths because that is the judgement an author makes worst about their own work.

Where the repository is public (`gh repo view --json visibility`), run the [`open-source`](../open-source/SKILL.md) skill's review over the change.

## 8. Read your own diff

`git --no-pager diff`, every line, as if reviewing someone else:

- Is the line count proportional to the change described?
- Did anything move that did not need to?
- Is any file in it one you did not mean to touch?

## 9. Commit and PR text

Match the repository's observed commit style (`git log`). A commit message answers to [5C](../elegance/references/cells/5C-commit.md) and a PR body to [4C](../elegance/references/cells/4C-merges.md). End both with the attribution lines the session supplies.

## 10. Stop at a verified diff

Make the change, verify it, show the diff, and stop. Committing, pushing, and opening a pull request are the user's call unless they have handed you the branch.
