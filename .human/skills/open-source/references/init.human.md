> Publishing cannot be undone, so init reads every object ever held and proves coverage before anything is proposed.

Fires: a repo about to go public, or already public and under audit. Part of [open-source](../SKILL.human.md).

```
Secrets → Examples → Leads → Binaries → Licensing → Triage → Propose
                                                                  │
          rewrite makes new objects ↺ init runs again on the result
```

## What is in scope

| Scope | Covers | Read with |
|---|---|---|
| Refs | every ref to be published (all unless the user names fewer) | `git for-each-ref` |
| ⚠️ PR refs | repo already public: pull-request refs, which no branch rewrite removes | `git fetch origin '+refs/pull/*:refs/remotes/pull/*'` |
| Blobs | every blob those refs reach, deleted files included | `git rev-list --objects <refs>` (each once, with a path it had) |
| Commits | message, author and committer names and emails | · |
| Tags and names | every annotated tag's message; every branch and tag name | · |
| Host surfaces | repo already public: issues, PRs and comments, releases, wiki | `gh` |

## The manifest

The orchestrator keeps these in session scratch, beside [the leads](leads.human.md).

| File | Holds |
|---|---|
| `objects` | every commit, blob, tag id in scope; sorted, one per line |
| `refs` | ref names, which have no id of their own |
| `read` | every id a scanner reports reading to its end |
| `skipped` | ids step 3 does not read: binaries (step 4), lockfiles, generated and vendored code |

✅ Coverage proven when this prints nothing:

```
comm -23 objects <(sort -u read skipped)
```

⛔ Anything it prints went unscanned; init is not done.

## Order

Every step runs; step 2 only when examples exist.

| # | Step | How |
|---|---|---|
| 1 | Secrets | `gitleaks git --log-opts="--all"`; complete over history, cheap |
| 2 | Examples | ⚠️ only when examples exist: pipe each to `grep -F -i -f <(cut -f2 examples)`: text blobs via `git cat-file --batch`; messages via `git log <refs>`; tags via `git for-each-ref refs/tags --format='%(objectname) %(contents)'` |
| 3 | Leads | `open-source-scan` over every blob and message not in `skipped`, fanned out under `parallelize` |
| 4 | Binaries | images, PDFs, archives listed with path and size; no scan reads them, yet they carry text and metadata |
| 5 | Licensing | tree each published ref points at, against [licensing](licensing.human.md) |
| 6 | Triage | `open-source-triage` over every flag, the binaries, the licensing findings |
| 7 | Propose | triage's groups go to the user; ⛔ the user decides each fix |

⚠️ A rewrite produces new objects: init runs again on the result ↺.

## What the fan-out answers

The `parallelize` questions, for step 3.

| Question | Answer |
|---|---|
| Units | one batch file in scratch per scanner, sections headed `=== <id> <path or kind>`: blobs, or commit messages and identities, or tag messages and ref names under id `refs`; about 2,000 lines so one scanner reads it whole; a longer blob is a batch alone |
| Edges | · none between units; the leads are the contract each reads, pinned before the fan-out |
| Action | step 3 |
| Done | ✅ every id its batch holds is on its `read:` list |
| Checks | · none per unit; step 6 is the check |
