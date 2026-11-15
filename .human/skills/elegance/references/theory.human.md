> A representation stands in for a reality nobody holds. Every element in it costs, so keep few and keep them checked.

```
Observation → Current → Future → Action → Past → Observation
```

Terms build in order; §5 links the axes.

## 1 · Reality and perception

### 1.1 Reality and representation

Reality → partial, delayed perception → representation. It is only as fresh as its last contact with the world.

### 1.2 Elegance

| Term | Means |
|---|---|
| Elegance | maximum clarity with the fewest possible elements |
| Clarity | predictive validity: acting on the node lands where intended |
| Fewest | the cost side: each element can drift, must be read, must agree with neighbors; the next change costs more as the count rises |
| One objective | an element adding no clarity adds only drift |
| Abstractness | feedback latency, from minutes (file) to a decade (principle); the ladder a node's scope sits on, six tiers |
| Generality is not vagueness | a crisp principle is tested by what derives from it; a vague one gets no feedback and is never corrected |

### 1.3 Completeness and attention

- Completeness is bounded by purpose: ask whether what is missing would change an action.
- Attention follows the map. Regions it stops pointing at decay unseen, and each added element thins attention on the rest.

## 2 · Information and action

### 2.1 The loop

| Station | Is |
|---|---|
| Current | what observation keeps true |
| Future | derives from current: what could be, then what will be once decided |
| Action | changes the world |
| Past | the record action leaves |

The graph touches reality at two points only, observation and action. Every other edge is inference, and most drift enters where inference outran contact.

### 2.2 Time as the station

Time is the station, not the tense. A sentence does not carry which.

| Same list | Station | Wrong when |
|---|---|---|
| in the shopper's hand | future | home without butter |
| in the detective's notebook | past | it says butter and he bought none |

The decision is a check mark on a plan, whether those with standing agreed; a separate node would duplicate it.

### 2.3 The graph

Improve the graph by altering it, deletion included, more often than by expanding it.

- **Connectedness**, how much sits downstream, is a signal where it disagrees with abstractness: an abstract node with few dependents is a proposal; a concrete node with many hides a load-bearing detail.
- **The artifact is the node.** Code, schema, contract and data carry meaning in name, types, structure and tests. A comment is a second node, earning a place only for what the first cannot carry and when shorter.
- **Edges beat copies.** A reference costs one lookup; a restatement costs agreement forever. The one legitimate copy is a summary one scope above its source, linked back. Same scope is repetition; below is misplacement.
- **A duplicate is a missing edge.** One is the source; delete the other and point at it.
- **Derivable is not written.** Counts and directory contents go wrong when things move; the thing that computes a number prints it.
- ⚠️ Claims over a set (*the only*, *all but*, coverage lists) turn false when the set grows elsewhere, and no diff of their own file shows it. Derive membership where the set is defined.

## 3 · Drift

### 3.1 Drift

| Form | Means |
|---|---|
| Incorrectness | representation and reality disagree |
| Incompleteness | reality holds what the graph lacks |

Drift is a rate, not a level. A check refuses incorrectness only, so green is evidence of correctness, never coverage; holes must be representable ([§3.4](#34-holes)). Adding to cure incompleteness breeds incorrectness, almost every time.

### 3.2 How drift compounds

| Mechanism | How |
|---|---|
| Derivation | an error in a fundamental node is inherited downstream before anyone rereads it |
| Attention | a drifted region stops being visited |
| Residue | a correction leaving a trace of what it replaced pulls the next edit back toward the old shape |
| Repetition | two nodes that must agree, with nothing making them |
| Misplaced scope | fastest of all: a function comment explaining the architecture goes stale whenever it moves, and nobody looks for architecture inside a function |

### 3.3 Pricing drift

```
fundamentalness = abstractness × connectedness
risk            = (1 − confidence) × fundamentalness
```

Confidence is the check that was passed, never the author's feeling or the prose's fluency. Strongest to weakest:

1. a gate that makes the wrong state impossible
2. runtime validation
3. review by a person at that scope
4. a bare assertion

It reaches no further than the check ranged. ⚠️ Agent output enters at assertion however it reads.

### 3.4 Holes

Incompleteness is invisible from inside, so an open question is a named hole: a marker on an empty place at a known scope. Without holes only correctness can be corrected.

## 4 · Alignment

### 4.1 The orbit

Alignment is an orbit, never a state: correct drift faster than it accumulates. Expand only as fast as you can check; where only judgment exists, slow down and build a check.

### 4.2 Where information goes

Raise the rung before writing more. Strongest first:

1. the artifact (name, type, test)
2. a gate
3. runtime validation
4. colocation
5. a triggered procedure
6. a path-scoped note
7. an always-loaded sentence, which buys routing, not knowledge

Place by scope: summarize upward, reference sideways, never explain downward. Ask whether a reader here needs it and whether a reader elsewhere would find it here.

Addition is the default for agents: completion is rewarded, addition is locally safe, deletion needs global knowledge, a document is a free place for uncertainty. Restraint needs its own artifact: non-goals in the plan, what was not changed at close, reuse-or-justify before anything new.

Outputs of a capture tool, in order: make the artifact carry it → link to where it lives → edit the node that holds it → add one, naming its scope and what it retires.

### 4.3 Keeping the loop closed

| Practice | Means |
|---|---|
| Show its own drift | every scope has a named instrument with a cadence; holes are marked |
| Subtract as cheaply as add | the prune set is computable: low connectedness at assertion confidence |
| Finish every change | finished when nothing left describes what it replaced |

## 5 · The axes

Every artifact sits in one cell of scope × time, and each cell has a type of location where its information belongs.

| Axis | Is | Page |
|---|---|---|
| Scope | ladder of feedback latency, six tiers | [scope](scope.human.md) |
| Time | station in the loop | [time](time.human.md) |
| Grid | the cells and their locations | [grid](grid.human.md) |
