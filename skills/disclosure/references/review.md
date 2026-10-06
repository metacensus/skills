# review

A change fits one context, so review needs no fan-out.

## What is in scope

- **The lines the change adds**: `git diff <base>...HEAD`, plus anything staged or untracked that will join it. Whole new files — fixtures, data, images — count in full.
- **Its commits**: messages, author and committer identities, from `git log <base>..HEAD`.
- **Its names**: the branch, and any tag.
- **Text written for the host** — a pull request's title and body, an issue, a comment, release notes — read as a draft, before it is posted.

## Order

1. **Secrets** — `gitleaks git --log-opts="<base>..HEAD"`, and `gitleaks dir` over what is not yet committed.
2. **Literal terms** — the same text through `grep -F -i -f <(cut -f2 terms.tsv)`.
3. **Variants and categories** — one [`disclosure-scan`](../../../agents/disclosure-scan.md) over the same text, in one batch file.
4. **Licensing** — when the change adds a dependency, a license file, a manifest, or code from elsewhere, against [licensing.md](licensing.md).
5. **Triage, fix, and run again** until nothing real is found.

## Fixing

- **Before the push, rewrite the branch** — amend or rebase — so no commit carries the term.
- **After the push, it is public**: the user decides on a rewrite, and a pull request's refs keep the old commits whatever the branch becomes.
