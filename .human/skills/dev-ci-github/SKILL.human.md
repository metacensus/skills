> A change moves through gates to a release; a failed gate stops it, and the tag is the last gate.

Fires: writing or reviewing a workflow, Makefile target, pre-commit hook, Dockerfile build step or release; deciding what CI gates.

```
Edit ─hook: check only→ Commit ─push / PR→ Checks ─aggregate: all success→ ✅ Mergeable
                                                                               │
Publish ←CI re-run at tag─ Tag vX.Y.Z ←─────────make release TYPE=───────────┘
```

Key: ⛔ run fails · ⚠️ silent trap · ✅ passes · `→` then

## CI runs `make`

Every check is a `make` target; a workflow step calls it and never re-spells it.

| Target | Does |
|---|---|
| `make check` | all of CI except the freshness diff |
| `make help` | prints `## target — what it does` comments |

## One toolchain, read from a committed file

| Thing | Pinned by | Detail |
|---|---|---|
| Go | `go-version-file: go.mod` | · |
| Tools (buf, protoc plugins, mockery) | `tool` directives in a `go.mod` consumers never import | installed to repo-local `.bin`, first on `PATH` |
| Generation | `GOWORK=off` + `GOTOOLCHAIN` from that `go.mod` | guard ⛔ fails on empty · ⚠️ Go accepts `GOTOOLCHAIN=` silently |
| Slow-to-build tool | cache keyed on `go.sum`, `go.mod`, `Makefile` | · |
| Node | `node-version-file: .nvmrc` | Dockerfile `node` base, same major |
| Node deps | `npm ci` from lockfile | tools from `node_modules`, never global |

- `GOWORK=off`: a workspace member cannot rebuild generators at another version (protoc-gen-go stamps it).
- `GOTOOLCHAIN`: a newer gofmt reformats generated comments.

## Committed output matches its source

| Gate | ✅ when |
|---|---|
| Generated code, build output | regenerate + build → `git diff --exit-code` clean, no untracked files |
| Modules | `go mod tidy` leaves `go.mod`, `go.sum` unchanged |
| Format | `gofmt -l` empty · `prettier --check` passes |
| Vet | `go vet`, including `integration`- and `artifact`-tagged code |
| Lint | golangci-lint, committed config |

Pre-commit hooks: via `make` · check, never rewrite · skip generated paths · opt-in; CI enforces.

## Workflow shape

```
trigger → orchestrator → reusable checks (workflow_call) → aggregate job → required status
```

| Part | Rule |
|---|---|
| Aggregate | the only required check; needs every check, `if: always()`; ⛔ unless each result is `success` · ⚠️ a skipped job reads as passing |
| `concurrency` | `cancel-in-progress`, grouped by workflow + ref |
| `permissions` | `contents: read` on top; a job needing more grants itself |
| `timeout-minutes` | every job |
| Path filters | where a repo holds several deployables |

## Test the artifact CI built

Build once: buildx `load: true`, CI tag → artifact suite receives it as `SERVICE_IMAGE`.

## Secrets

| When | Then |
|---|---|
| job reads a secret | runs on pushes and same-repo PRs only |
| secret missing | preflight ⛔ fails, one line: secret name + command that sets it |
| test step | sets `REQUIRE_*` |

## Release from a tag

```
make release TYPE=patch|minor|major → tag → CI re-runs at tag → ✅ gates every publish → images · packages
```

| Step | Rule |
|---|---|
| `make release` | derives next semver · ⛔ empty result · ⛔ tag already on `origin` |
| Trigger | semver tags only: `v[0-9]+.[0-9]+.[0-9]+` |
| Images | multi-arch · tags: ref, short sha, `latest` · compile on `$BUILDPLATFORM`, cross-compile to `TARGETOS/TARGETARCH` |
| Docker Hub login | OIDC via `docker/login-action`: org as `username`, `DOCKERHUB_OIDC_CONNECTIONID` in env, `id-token: write` |
| Hub connection | one per repo; subject `repo:<org>@<owner_id>/<repo>@<repo_id>:ref:refs/tags/v*` (set `use_immutable_subject`) |
| npm packages | trusted publishing (OIDC) + provenance · a job with `id-token: write` installs `--ignore-scripts` |

⚠️ Hole: vulnerability and license checks — metacensus/skills#13.
