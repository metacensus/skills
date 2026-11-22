# init

## What is in scope

- **Every ref to be published** — all of them unless the user names fewer, from `git for-each-ref`. For a repository already public on GitHub, also its pull-request refs, which no rewrite of its branches removes: `git fetch origin '+refs/pull/*:refs/remotes/pull/*'`.
- **Every blob those refs reach**, deleted files included: `git rev-list --objects <refs>` lists each once, with a path it had.
- **Every commit**: its message, and its author and committer names and emails.
- **Every annotated tag's message**, and the names of every branch and tag.
- **The host's other surfaces**, for a repository already public: issues, pull requests and their comments, releases, wiki, through `gh`.

## The manifest

Session scratch holds, beside [the leads](leads.md#the-sessions-copy):

- **`objects`** — every commit, blob, and tag id in scope, and `refs` for the ref names, which have no id of their own; sorted, one per line.
- **`read`** — every id read to its end.
- **`skipped`** — the ids step 3 does not read: binaries (step 4), lockfiles, generated and vendored code.

Coverage is proven when `comm -23 objects <(sort -u read skipped)` prints nothing. Whatever it prints went unscanned, and init is not done.

## Order

1. **Secrets** — `gitleaks git --log-opts="--all"`, complete over history and cheap.
2. **Examples**, where there are any — every text blob through `git cat-file --batch`, every message through `git log <refs>`, every tag through `git for-each-ref refs/tags --format='%(objectname) %(contents)'`, each piped to `grep -F -i -f <(cut -f2 examples)`.
3. **Leads** — every blob and message not in `skipped`, read as [review's step 3](review.md#order) reads.
4. **Binaries** — images, PDFs, archives, listed with path and size; no scan reads them, and they carry text and metadata.
5. **Licensing** — the tree each published ref points at, against [licensing.md](licensing.md).
6. **Triage** — every flag, the binaries, and the licensing findings, judged as [review's step 5](review.md#order) judges. Each real one is located, `git log --all --find-object=<blob>` naming the commit that introduced it and the refs that reach it, with whether the published tip still holds it. They are grouped by lead, then by where they sit: the tip only, history only, or both; pushed or not.
7. **Propose** — one fix per group, to the user, who decides each: remove it going forward, rewrite history (`git filter-repo` with `--replace-text` or `--invert-paths`), withhold the repository, rotate a secret, or record an exception.

A rewrite produces new objects, so init runs again on the result.
