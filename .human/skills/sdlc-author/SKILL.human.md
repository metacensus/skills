> The author carries an issue from pickup to closed, one stage at a time.

Fires: picking up, starting, working, finishing or landing an issue; answering its review; asking what is ready to start.

```
Precheck → Design → Implement → Self-review → Publish → (review) → Respond ⟲ → Land
                                                                    ▲_______|  until review passes
Spike:        Design ────────────────────────────────────────────────→ Land  (ends at `Decision:`)
action Task:  role runs command → Land
```

⬜ each stage runs [the hub's protocol](../sdlc/SKILL.human.md#stages), the mapping's Checks rows included · a stage fixes what it can before reporting, even in an earlier stage's work.

⛔ escalate (waits on a person) · ⏸️ stop (author halts)

| Stage | Pass → | ⛔ Escalate | ⏸️ Stop |
|---|---|---|---|
| Precheck | Design; Implement if `designed` | fix the author may not [make](../sdlc/SKILL.human.md#roles) (e.g. missing field in another's body) | assigned to another · blocked · parent closed · past In progress |
| Design | `designed` applied | until `designed`: by a person, or a remit covering Design | issue fails its bar |
| Implement | Self-review | design or requirements shift · new context questions the work | criterion unmeetable · parent must change |
| Self-review | Publish | span disputed at loop cap · finding in pushed history | Verification block cannot pass as written |
| Publish | review | before linking, unless remit hands over the branch | · |
| Respond | review passes → Land | span disputed at loop cap | finding reopens design or a criterion |
| Land | closed | merge, where neither Roles nor remit reach it · close only if `deviated` or **not planned** | PR cannot merge without reopening a criterion |

Land's escalation ends the run; whoever takes it completes Land. A plain completion never escalates.

## Precheck

Ready work: [the hub's query](../sdlc/SKILL.human.md#status).

- Body has its form's required fields.
- [Derived status](../sdlc/SKILL.human.md#status) is Ready, or In progress assigned to me (`gh api user --jq .login`).
- Every `blocked by` closed; parent open.
- Card sits in its status's column, then [`sdlc-status --apply`](../sdlc/SKILL.human.md#status).

## Design

- Body is written for a person: scoped, summarized, explained.
- Comment proposes a design for what the body leaves open.
- Issue meets [the ladder's](../sdlc/SKILL.human.md#the-ladder) bar for its type.

## Implement

- Status In progress: assign me, then [`sdlc-status --apply`](../sdlc/SKILL.human.md#status).
- Branch is [`checkin`'s](../checkin/SKILL.human.md).
- [`elegance`](../elegance/SKILL.human.md) governs every line.
- Too large for one agent → [`parallelize`](../parallelize/SKILL.human.md), answered:

| Unit | Edge | Action | Done | Checks |
|---|---|---|---|---|
| the design's pieces | contracts the design settled | build each | its criteria + the gate | `elegance` |

## Self-review

- PR body drafted to [4C](../elegance/references/cells/4C-merges.human.md).
- [`elegance-review`](../../agents/elegance-review.human.md) has run over diff and draft, in [the review loop](../elegance/SKILL.human.md#the-review-loop); large → `parallelize` along Implement's units.
- Public repo: [`open-source`'s review](../open-source/references/review.human.md) has run.
- Verification block exits 0 · repository gate exits 0.

## Publish

- [`checkin`](../checkin/SKILL.human.md) holds → branch [linked](../sdlc/SKILL.human.md#linking-an-issue-to-its-branch-and-pr) → pushed.
- `gh pr create`: drafted body + `Closes #N`.
- Reviewers named in the mapping's Roles requested.
- Status In review, then [`sdlc-status --apply`](../sdlc/SKILL.human.md#status).

## Respond

- Each finding of [the review](../sdlc-review/SKILL.human.md) applied or declined, in [the review loop](../elegance/SKILL.human.md#the-review-loop).
- PR reply lists which, and why.
- Verification block and gate exit 0 on the new head.

## Land

- PR merged on the review's pass.
- Issue closed per [the hub's Closing table](../sdlc/SKILL.human.md#closing).
- Follow-ups filed via [`sdlc-intake`](../sdlc-intake/SKILL.human.md).
- Status Done, then [`sdlc-status --apply`](../sdlc/SKILL.human.md#status).

## Without a pull request

| Case | Path | Ends at |
|---|---|---|
| Spike | Design → Land | its confirmed `Decision:` |
| Action Task (step only a role can take) | role gets the command + expected output, replacing Implement through Respond | Land, closed by its Verification |
