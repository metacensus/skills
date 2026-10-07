How to run CI and release for Go and Node repositories.

## CI runs `make`

Workflows call `make` targets rather than re-spelling them.

## One toolchain, read from a committed file

Go and every generator are pinned in `go.mod`, and generation runs under `GOWORK=off` and an exact `GOTOOLCHAIN`. Node comes from `.nvmrc`, dependencies from `npm ci`.

## Committed output matches its source

CI fails on stale generated code or build output, untidy modules, formatting, vet, or lint; hooks check and never rewrite.

## Workflow shape

Reusable checks behind one required job that fails on any non-success, with cancellation, read-only permissions, timeouts, and path filters.

## Test the artifact CI built

The image is built once and the artifact suite runs against it.

## Secrets

Secret-reading jobs skip forks and fail loudly when a secret is missing.

## Release from a tag

A guarded `make release` tags; a semver-only trigger re-runs CI, then publishes.

## Scheduled checks

Nightly `govulncheck` or `npm audit` and a weekly build.
