> A PR review, request to verdict, per [the hub's protocol](../sdlc/SKILL.human.md#stages).

Fires: reviewing; asked if it may merge.

Precheck → Summarize → Focus → Verdict

## Precheck

|Must hold|⛔|🛑|
|---|---|---|
|Remit or requested; not a draft|·|own PR, draft|
|Closes an In review issue|no link|closed|
|CI passed|running|failing|

## Summarize

From diff and body alone, each choice. ⛔ unexplained · 🛑 too large.

## Focus

1. What breaks, for whom?
2. What is irreversible?
3. What is the author likeliest wrong about?
4. Which location doesn't gate, per `check-cells --diff`?
5. Would Verification catch a failed criterion?
6. Does the PR do what the issue asked, nothing else?

Then `elegance`, the mapping's Checks, Verification; unfinished blocks a pass.

|Verdict|When|
|---|---|
|✅ Pass|no finding needs a choice|
|⛔ Escalate|fix is no one here's|
|🛑 Stop|finding reopens design|
