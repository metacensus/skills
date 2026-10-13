How to write and test Temporal workflows in Go.

## Proto is the contract

Proto declares, a generator types, the implementation fulfils. Never edit generated code or docs; register every module, or it fails at runtime.

## A workflow is a constructor and an Execute

The constructor validates; Execute orchestrates. Replay demands determinism: I/O in activities, time and concurrency from `workflow`, command changes behind `GetVersion`.

## Ownership is the worker's identity

One security context per workflow: the worker's owner, or a typed owner resolved once. Children stay in it; crossing owners is Nexus. Branch on structure, not labels. Generate policies from the path methods.

## Testing adds environments and replay

`dev-testing-go`'s conventions, plus Temporal's test environments. Unit tests prove the code orchestrates correctly; replay tests, in their own file over recorded histories, prove it still accepts what running executions wrote.

## Plan tests before writing them

Name the file, find the gaps, ask what is unclear, and confirm a per-function case table first.
