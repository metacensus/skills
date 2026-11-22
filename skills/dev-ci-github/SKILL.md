---
name: dev-ci-github
description: How to run CI and release on GitHub Actions for Go and Node repositories. Trigger when writing or reviewing a workflow, Makefile target, pre-commit or pre-push hook, Dockerfile build step, or release process, or when deciding what CI should gate.
---

## CI runs `make`

Every check is a `make` target that a workflow step calls rather than re-spells. `make check` runs everything CI does but the freshness diff, and `make help` prints from `## target — what it does` comments.

## One toolchain, read from a committed file

- **Go** comes from `go-version-file: go.mod`.
- **Tools** — buf, protoc plugins, mockery — are `tool` directives in the `go.mod` of a module consumers never import, installed into a repo-local `.bin` that heads `PATH` for generation.
- **Generation runs under `GOWORK=off` and `GOTOOLCHAIN`** read from that `go.mod`, with a guard that fails when the value reads empty. `GOWORK=off` keeps a workspace member from rebuilding the generators at another version, which protoc-gen-go stamps into every file; `GOTOOLCHAIN` pins the compiler exactly, since a newer gofmt reformats generated comments; Go accepts an empty `GOTOOLCHAIN=` silently.
- **A tool that is slow to build is cached** on the files that pin it — `go.sum`, `go.mod`, `Makefile`.
- **Node** comes from `node-version-file: .nvmrc`, and the Dockerfile's `node` base carries the same major; dependencies install with `npm ci` from the committed lockfile, and tools run from `node_modules`, never a global install.
- **The lockfile is written on Linux**, in a `node` container of that major: one written on macOS can drop other platforms' nested optional dependencies, which `npm ci` refuses.
- **Third-party images a workflow runs**, service containers and `container:` jobs included, are pinned by digest.

## Committed output matches its source

- **Generated code and build output**: CI regenerates and builds, then fails on `git diff --exit-code` and on any untracked file.
- **Modules**: `go mod tidy` leaves `go.mod` and `go.sum` unchanged.
- **Formatting and vet**: `gofmt -l` prints nothing and `prettier --check` passes; `go vet` covers `integration`- and `artifact`-tagged code too.
- **Lint**: golangci-lint runs from a committed config.
- **Pre-commit hooks reach tools through `make`, check, never rewrite, and exclude generated paths**; installing them is opt-in, and CI is the enforcement.

## Workflow shape

- **An orchestrator per trigger** calls reusable `workflow_call` checks.
- **One aggregate job**, the only required status check, depends on every check under `if: always()` and fails unless each result is `success`, since a skipped required job reports as passing.
- **`concurrency` grouped by workflow and ref, with `cancel-in-progress`**; a workflow whose run changes something outside itself (applies infrastructure, deploys, rolls out, releases) sets `cancel-in-progress: false` so runs queue, grouped by what it changes rather than by ref.
- **`permissions: contents: read`** at the top; a job that needs more grants it to itself.
- **`timeout-minutes`** on every job; **path filters** where a repository holds several deployables.

## CI blocks every merge

- **Every repository requires its aggregate check from creation**: a repository ruleset with `required_status_checks` on `~DEFAULT_BRANCH`, organization admins its only bypass, no review rule. An organization ruleset needs a paid plan.
- **GitHub Free answers 403** to a private repository's rulesets and branch protection; the ruleset lands once the plan allows it.
- **Never ask whether CI should block merges**, nor offer going without a required check.

## Test the artifact CI built

The build job builds the image once with buildx `load: true` under a CI tag and passes that tag to the artifact suite as `SERVICE_IMAGE`.

## Secrets

A job that reads a secret runs on pushes and same-repository pull requests only. A preflight step fails with one line naming the missing secret and the command that sets it, and the test step sets `REQUIRE_*`.

An image build that fetches private packages receives the credential as a BuildKit secret (`RUN --mount=type=secret`) through the build action's `secrets:` input: a `.netrc` under `GOPRIVATE` for Go, an `.npmrc` for Node.

## Before a public push

In a public repository (`gh repo view --json visibility`), `gitleaks git --log-opts="origin/<default>..HEAD"` over the outgoing commits and `gitleaks dir` over the working tree exit 0 before the push. A `pre-push` hook may run both, opt-in as pre-commit hooks are. CI repeats `gitleaks git` over the whole history: checkout takes `fetch-depth: 0`, and the step runs the gitleaks image pinned by digest, since gitleaks-action needs a license key in an organization's repository.

## Release from a tag

- **`make release TYPE=patch|minor|major`** derives the next semver, refuses an empty result, and refuses a tag that exists on `origin`.
- **A Publish issue tracks the tag**, and its title follows it.
- **The release triggers only on a pushed semver tag**: `on: push: tags: ['v[0-9]+.[0-9]+.[0-9]+']`.
- **The release re-runs CI at the tagged commit** through `workflow_call` and gates every publish on it.
- **Images** publish multi-arch, tagged by ref, short sha, and `latest`; the Dockerfile compiles on `$BUILDPLATFORM` and cross-compiles to `TARGETOS/TARGETARCH`.
- **A second registry receives the image by digest**: `docker buildx imagetools create --tag <second>:<tag> <first>@<digest>`.
- **Docker Hub login is OIDC**: `docker/login-action` with the organization as `username`, `DOCKERHUB_OIDC_CONNECTIONID` in its env, and `id-token: write`. Each repository has its own connection, its subject GitHub's immutable `repo:<org>@<owner_id>/<repo>@<repo_id>:ref:refs/tags/v*` (set `use_immutable_subject`).
- **Packages** publish through npm trusted publishing (OIDC) with provenance, from npm 11.5.1 and Node 22.14 or later; a job holding `id-token: write` installs with `--ignore-scripts`, and `repository.url` in `package.json` names the publishing repository, which publishing checks.
- **Before the first release**, an owner creates the Docker Hub repository, public or private as intended, and publishes the first npm version by hand, then registers the GitHub repository and the release workflow's filename as its trusted publisher: OIDC creates neither.

## Where CI stops

- **`gh pr merge --auto` fails where repository auto-merge is off.**
- **A run that fails or queues with no step output** is checked against Actions billing first: a spending limit stops jobs from starting.
- **A Terraform plan runs on its pull request; the apply is run by a person**, never by a job a merge triggers.

**Hole:** vulnerability and license checks — metacensus/skills#13.
