# review

A change fits one context, so review needs no fan-out.

## What is in scope

- **The lines the change adds**: `git diff <base>...HEAD`, plus anything staged or untracked that will join it. Whole new files — fixtures, data, images — count in full.
- **Its commits**: messages, author and committer identities, from `git log <base>..HEAD`.
- **Its names**: the branch, and any tag.
- **Text written for the host** — a pull request's title and body, an issue, a comment, release notes — read as a draft, before it is posted.

## Order

1. **Secrets** — `gitleaks git --log-opts="<base>..HEAD"`, and `gitleaks dir` over what is not yet committed.
2. **Examples**, where there are any — the same text through `grep -F -i -f <(cut -f2 examples)`.
3. **Leads** — one [`open-source-scan`](../../../agents/open-source-scan.md) over the same text, in one batch file, and its `unread:` is empty.
4. **Licensing** — when the change adds a dependency, a license file, a manifest, or code from elsewhere, against [licensing.md](licensing.md).
5. **Triage** — the [`open-source-triage`](../../../agents/open-source-triage.md) agent over the flags, any binaries the change adds, and the licensing findings.
6. **Fix**, then run again until nothing real is found.

## Fixing

Make the fix, then tell the user what changed. A commit not yet pushed is the change's own, so amend or rebase it until no commit carries the span.

Ask first only where the fix is ambiguous, or reaches past the change:

- the span has more than one fair replacement;
- the fix edits what the change did not touch;
- the commit is already pushed — a pull request's refs keep it whatever the branch becomes, so rewriting is the user's call.
