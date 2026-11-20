> A change moves through gates to a release; a failed gate stops it, and the tag is the last gate.

Fires: writing or reviewing a workflow, Makefile target, hook, Dockerfile or release.

```
Edit → Commit → Checks ─all success→ ✅ Mergeable → Tag vX.Y.Z ─CI re-run→ Publish
```

## CI runs `make`

Each check is a `make` target; `make check` is CI minus the freshness diff.

## Pinned toolchain

| Thing | Pinned by |
|---|---|
| Go, tools | `go.mod` |
| Generation | `GOWORK=off` + `GOTOOLCHAIN`; ⚠️ empty passes silently |
| Node | `.nvmrc`; lockfile written on Linux |
| Third-party images | digest |

## Output matches source

Generated files: `git diff --exit-code` clean. Modules: `go mod tidy` changes nothing.

## Workflow shape

The aggregate job is the only required check: ⛔ unless all `success`; ⚠️ skipped reads as passing.

## Release from a tag

`make release TYPE=` ⛔ on an empty result or existing tag; publish waits on CI.

- 🩷 Before the first OIDC publish: create the Docker Hub repository; publish the npm package by hand.
- A second registry copies by digest.

## Where CI stops

- `gh pr merge --auto` fails where auto-merge is off.
- ⚠️ A run with no step output: check the spending limit first.
- 🩷 Terraform: plan on the PR; a person applies.

⚠️ Hole: vulnerability and license checks — metacensus/skills#13.
