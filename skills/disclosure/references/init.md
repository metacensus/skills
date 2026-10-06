# init

Making a repository public publishes every object it has ever held, not its last commit. So the check covers all of them, and its result is only as good as the proof that it did.

## What is in scope

- **Every ref to be published** — all of them unless the user names fewer, from `git for-each-ref`. For a repository already public on GitHub, also its pull-request refs, which no rewrite of its branches removes: `git fetch origin '+refs/pull/*:refs/remotes/pull/*'`.
- **Every blob those refs reach**, deleted files included: `git rev-list --objects <refs>` lists each once, with a path it had.
- **Every commit**: its message, and its author and committer names and emails.
- **Every annotated tag's message**, and the names of every branch and tag.
- **The host's other surfaces**, for a repository already public: issues, pull requests and their comments, releases, wiki, through `gh`.

Scan blobs rather than diffs: each content is read once however many commits carry it.

## The manifest

The orchestrator keeps, in session scratch:

- **`objects`** — every commit, blob, and tag id in scope, sorted, one per line.
- **`terms.tsv`** — derived from the mapping, as [terms.md](terms.md#deriving-the-list) says.
- **`read`** — every id a scanner reports reading to its end.
- **`skipped`** — the ids step 3 does not read: binaries (step 4), lockfiles, generated and vendored code.

Coverage is proven when `comm -23 objects <(sort -u read skipped)` prints nothing. Whatever it prints went unscanned, and init is not done.

## Order

1. **Secrets** — `gitleaks git --log-opts="--all"`, complete over history and cheap.
2. **Literal terms** — every text blob through `git cat-file --batch`, every message through `git log <refs>`, every tag through `git for-each-ref refs/tags --format='%(objectname) %(contents)'`, each piped to `grep -F -i -f <(cut -f2 terms.tsv)`. A literal hit is complete and needs no model.
3. **Variants and categories** — the [`disclosure-scan`](../../../agents/disclosure-scan.md) agent over every blob and message not in `skipped`, fanned out under [`parallelize`](../../parallelize/SKILL.md).
4. **Binaries** — images, PDFs, archives, listed with path and size for the user; no scan reads them, and they carry text and metadata.
5. **Licensing** — the tree each published ref points at, against [licensing.md](licensing.md).
6. **Triage** — merge the hits and licensing findings, drop the false ones, and locate each real hit: `git log --all --find-object=<blob>` names the commit that introduced it and the refs that reach it, which is what a rewrite decision weighs.

A rewrite — `git filter-repo`, with `--replace-text` or `--invert-paths` — produces new objects, so init runs again on the result.

## What the fan-out answers

The [`parallelize`](../../parallelize/SKILL.md#what-the-work-answers) questions, for step 3:

- **Units** — a batch file in scratch, one per scanner, of sections headed `=== <id> <path or kind>`: blobs, or commit messages and identities, or tag messages and ref names. About 2,000 lines, so one scanner reads it whole; a longer blob is a batch alone.
- **Edges** — none between units; `terms.tsv` is the contract each reads, pinned before the fan-out.
- **Action** — step 3.
- **Done** — every id its batch holds is on its `read:` list.
- **Review** — none per unit; the orchestrator's triage is the check.
