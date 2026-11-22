> init reads every object ever held and proves coverage before proposing.

Fires: a repo going public, or public and under audit.

Secrets → Examples → Leads → Binaries → [Licensing](licensing.human.md) → Triage → ⛔ Propose

A rewrite makes new objects: init runs again ↺.

Scope: every ref · ⚠️ PR refs · every blob, deleted included · commits and identities · tag messages · host surfaces.

| Manifest | Holds |
|---|---|
| `objects` | every id in scope |
| `read` | ids scanned to the end |
| `skipped` | binaries, lockfiles, generated, vendored |

✅ Proven when `comm -23 objects <(sort -u read skipped)` prints nothing; ⛔ anything printed went unscanned.
