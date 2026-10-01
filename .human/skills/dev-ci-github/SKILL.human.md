How to run CI and release for Go repositories.

## CI runs `make`

Workflows call `make` targets rather than re-spelling them.

## One toolchain, read from `go.mod`

Go and every generator are pinned in `go.mod`, and generation runs under `GOWORK=off` and an exact `GOTOOLCHAIN`.

## Committed output matches its source

CI fails on stale generated code, untidy modules, formatting, vet, or lint; hooks check and never rewrite.

## Workflow shape

Reusable checks behind one required job, with cancellation, read-only permissions, timeouts, and path filters.

## Test the artifact CI built

The image is built once and the integration suite runs against it.

## Secrets

Secret-reading jobs skip forks and fail loudly when a secret is missing.

## Release from a tag

A guarded `make release` tags; a semver-only trigger re-runs CI, then publishes.

## Scheduled checks

Nightly vulnerability scans and a weekly build.
