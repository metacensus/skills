---
name: dev-ci-github
description: How to run CI and release on GitHub Actions for Go and Node repositories. Trigger when writing or reviewing a workflow, Makefile target, pre-commit hook, Dockerfile build step, or release process, or when deciding what CI should gate.
---

## CI runs `make`

Every check is a `make` target that a workflow step calls rather than re-spells. `make check` runs everything CI does but the freshness diff, and `make help` prints from `## target — what it does` comments.

## One toolchain, read from a committed file

- **Go** comes from `go-version-file: go.mod`.
- **Tools** — buf, protoc plugins, mockery — are `tool` directives in the `go.mod` of a module consumers never import, installed into a repo-local `.bin` that heads `PATH` for generation.
- **Generation runs under `GOWORK=off` and `GOTOOLCHAIN`** read from that `go.mod`, with a guard that fails when the value reads empty. `GOWORK=off` keeps a workspace member from rebuilding the generators at another version, which protoc-gen-go stamps into every file; `GOTOOLCHAIN` pins the compiler exactly, since a newer gofmt reformats generated comments; Go accepts an empty `GOTOOLCHAIN=` silently.
- **A tool that is slow to build is cached** on the files that pin it — `go.sum`, `go.mod`, `Makefile`.
- **Node** comes from `node-version-file: .nvmrc`, and the Dockerfile's `node` base carries the same major; dependencies install with `npm ci` from the committed lockfile, and tools run from `node_modules`, never a global install.

## Committed output matches its source

- **Generated code and build output**: CI regenerates and builds, then fails on `git diff --exit-code` and on any untracked file.
- **Modules**: `go mod tidy` leaves `go.mod` and `go.sum` unchanged.
- **Formatting and vet**: `gofmt -l` prints nothing and `prettier --check` passes; `go vet` covers `integration`- and `artifact`-tagged code too.
- **Lint**: golangci-lint runs from a committed config.
- **Pre-commit hooks reach tools through `make`, check, never rewrite, and exclude generated paths**; installing them is opt-in, and CI is the enforcement.

## Workflow shape

- **An orchestrator per trigger** calls reusable `workflow_call` checks.
- **One aggregate job**, the only required status check, depends on every check under `if: always()` and fails unless each result is `success`, since a skipped required job reports as passing.
- **`concurrency` with `cancel-in-progress`**, grouped by workflow and ref.
- **`permissions: contents: read`** at the top; a job that needs more grants it to itself.
- **`timeout-minutes`** on every job; **path filters** where a repository holds several deployables.

## Test the artifact CI built

The build job builds the image once with buildx `load: true` under a CI tag and passes that tag to the artifact suite as `SERVICE_IMAGE`.

## Secrets

A job that reads a secret runs on pushes and same-repository pull requests only. A preflight step fails with one line naming the missing secret and the command that sets it, and the test step sets `REQUIRE_*`.

## Release from a tag

- **`make release TYPE=patch|minor|major`** derives the next semver, refuses an empty result, and refuses a tag that exists on `origin`.
- **The release trigger matches semver only**: `v[0-9]+.[0-9]+.[0-9]+`.
- **The release re-runs CI at the tagged commit** through `workflow_call` and gates every publish on it.
- **Images** publish multi-arch, tagged by ref, short sha, and `latest`, with a registry token scoped to the organization; the Dockerfile compiles on `$BUILDPLATFORM` and cross-compiles to `TARGETOS/TARGETARCH`.
- **Packages** publish through npm trusted publishing (OIDC) with provenance; a job holding `id-token: write` installs with `--ignore-scripts`.

**Hole:** vulnerability and license checks — metacensus/skills#13.
