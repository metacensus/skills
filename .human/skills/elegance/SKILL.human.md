> Fewest elements that stay clear. Nothing is elegant, so "fine as is" is never a finding.

Fires: about to write, rewrite, review or remove anything persistent (code, comments, docs, plans, issues, data, memory, commit and PR text); or asked whether something should exist.

```
Element → what does the reader lose if it goes?
  ├ nothing   → Retire
  └ something → does a smaller or better-placed element carry it?
        ├ yes → Merge · Move up · Replace · Derive
        └ no  → keep, and name what it carries
```

## The test

The burden is on existence. An element stays because you can name what it carries that nothing else does, not because it is true, was written, or might be missed.

## The scope of an alteration

```
section → paragraph → sentence → word
retire first ───────────────► polish last
```

- ⚠️ Every sentence feels critical: you are too low. Go up one and ask what the paragraph is for.
- ⚠️ The urge to add means you have not yet found what to remove.

## Prose about code

| Purpose | Is | Placed | Test |
|---|---|---|---|
| Summary | a reduction | one scope above what it summarizes | almost never a comment |
| Illustration | of complex or obscured code | beside it | shorter than the code |

A comment on a ten-line private function means either it goes or the code should be refactored. A comment on why a function exists is a smell about the function. A shape repeated at every call site is a smell about the signature. Refactors that keep behavior at the package and feature boundary are in scope. More smells: cells 5B code and 4B surface.

## Moves

In this order; the order is the point.

| # | Move | Do | Why |
|---|---|---|---|
| 1 | Retire | delete what nothing loses; prune set = low connectedness at assertion confidence; keep a pointer only if no better lead (trigger, index, link at use) exists | [§4.3](references/theory.human.md#43-keeping-the-loop-closed) |
| 2 | Merge | two nodes saying one thing become one; pick which copy is the source | [§2.3](references/theory.human.md#23-the-graph) |
| 3 | Move up | summarize upward, reference sideways, never explain downward | [§4.2](references/theory.human.md#42-where-information-goes) |
| 4 | Replace with structure | a name, type, signature, test or gate carries it and cannot drift; point at a node that passed | [§4.2](references/theory.human.md#42-where-information-goes) |
| 5 | Derive | counts, contents lists, claims over a set: the thing that computes it prints it | [§2.3](references/theory.human.md#23-the-graph) |
| 6 | Rewrite whole | replace the element entirely so nothing describes what it replaced | [§4.3](references/theory.human.md#43-keeping-the-loop-closed) |
| 7 | Mark the hole | an open question is a named absence at a known scope, not filler prose | [§3.4](references/theory.human.md#34-holes) |
| 8 | Add, last | name its scope and what it retires; report restraint (non-goals, what was left alone and why) | [§4.2](references/theory.human.md#42-where-information-goes) |

## The model

The grid says where an element belongs; the reader decides whether it is clear. Terms: [theory](references/theory.human.md).

| Axis | Is | Values | Detail |
|---|---|---|---|
| Scope | feedback latency: how long reality takes to say a node is wrong | 0 principles · 1 field · 2 organization · 3 system · 4 module · 5 file; for the bottom three ask who must agree | [scope](references/scope.human.md) |
| Time | the station in the loop | A future (read to act) · B current (written from observation) · C past (written from action); same words at another station, opposite correction | [time](references/time.human.md) |
| Cell | scope × time, e.g. 3A | one file each; each names what excess looks like there | [grid](references/grid.human.md) |
| Confidence | the check that was passed, never fluency | agent output enters at assertion; risk = (1 − confidence) × dependents | [§3.3](references/theory.human.md#33-pricing-drift) |

## Questions worth asking

1. Summary or illustration, and is it shorter than what it describes?
2. Which element is this, and is there a larger one to ask about?
3. Where would the reader look for this, and is that here?
4. Could the artifact carry this instead of a sentence?
5. If the thing described changed, would anyone fix this?
6. Who loads this, and would a better lead let them find it when needed? A person reads little; brevity gets them to read.

## Before you finish

| | Ask | Do | Finding |
|---|---|---|---|
| ⬜ | What does each count say? | count: nodes holding one fact at a scope · values an argument takes · fields in a type · callers of an option · consumers outside an export's package | each count is the finding |
| ⬜ | Which cells did you touch? | `node ${CLAUDE_PLUGIN_ROOT}/scripts/check-cells.mts --diff` | an unexpected cell: undo the alteration or open the cell |
| ⬜ | Fresh eyes | hand the diff to the `elegance-review` agent; give no account of why, name no cell | a review that finds nothing owes its attempts |
| ⬜ | What points at what you altered? | grep the path, symbol and name; read hits as their reader | moved target, grown list, changed claim over a set |

## The review loop

```
Owner → run reviewer → apply findings → send back   (same reviewer; replies to findings, not reasons for the change)
```

At most 3 rounds. Each round both parties say whether they want another and name the spans that keep returning.

| Outcome | Looks like |
|---|---|
| Converging | findings shrink, move, and are applied |
| Known disagreement | owner declines with a reason; reviewer holds |
| Unknown disagreement | nobody says it, but a span returns: rewritten and flagged again, or a fix breeds a new finding there |

⛔ At the cap a disputed span goes up with both positions to whoever owns the decision; the rest lands.

## Reading the references

```
tier (how long reality takes) + station (how disagreement is settled) → cells/<tier><station>-*.md → location → elegance-mapping.md at repo root
```

Changing this skill: [README](README.human.md).
