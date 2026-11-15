> Licensing is checked against the mapping's rows, so a path no row reaches is a hole to report.

Fires: a change adds a dependency, license file, manifest, or outside code; any license audit. Part of [open-source](../SKILL.human.md), run as step 4 of [review](review.human.md) and in [init](init.human.md).

```
mapping rows (## Licenses) → longest glob wins → 9 checks → findings → `open-source-triage`
no glob reaches the path, or no row for the repo → ⛔ hole, report
```

## The intent

| Case | Result |
|---|---|
| path matches globs | takes the license of the longest matching glob in this repository's rows |
| no glob reaches the path | ⛔ hole: report it |
| repository has no row | ⛔ hole: report it |

## Checks

| # | Check | Passes when | Read with |
|---|---|---|---|
| 1 | License text | `LICENSE` or `COPYING` at the root holds the `**` license text, compared as text to the SPDX list, not by title | licensee, ScanCode |
| 2 | Exceptions | each path whose license differs from the root's says so inside the repo: a license file in its directory, or `SPDX-License-Identifier` headers | · |
| 3 | Headers | where files carry `SPDX-License-Identifier`, each names its path's license | · |
| 4 | Manifests | license field names the licenses of the paths it ships; an SPDX expression where they differ | `package.json`, `Cargo.toml`, `pyproject.toml` |
| 5 | Forks | under `upstream`, license text and any `NOTICE` equal the parent's | `gh api repos/<owner>/<name>` names the parent |
| 6 | Copied code | code from another project keeps its license and attribution | ScanCode finds copies a declared license hides |
| 7 | Dependencies | each license known, present, and compatible with the license of the path that imports it; report unknown, absent, or incompatible | `go-licenses report ./...`, `npx license-checker --summary` |
| 8 | Contributor terms | what the mapping requires (DCO or CLA) is in `CONTRIBUTING` and checked on pull requests | · |
| 9 | Patents | nothing states a patent position beyond the mapping's and the licenses' own terms | · |
