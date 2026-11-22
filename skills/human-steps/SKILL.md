---
name: human-steps
description: Walk a person through steps one per turn, each checked before the next — code they read a block at a time, commands only their hands run checked against their pasted output, or a queue of open questions answered one by one, spoken or typed. Trigger when the user asks to understand, explain, or walk through a file, package, or pull request; on `terraform apply`; a change in AWS, Cloudflare or DNS; registering a GitHub App; `gh secret set`; anything the permission classifier refuses; when a person asks to run commands or take questions one at a time; and when questions for a person queue, as in a side session a carrier starts.
---

**One step per turn; the next waits until this one is checked.**

| Steps | One step | Checked by |
|---|---|---|
| [Code](#code) the person reads | a block of 10 to 30 lines | their direction: continue, deeper, skip, or a question |
| [Commands](#commands) only their hands run | one command, or one action in a web console | their pasted output, against what success prints |
| [Questions](#questions) queued for them | one question | the read-back they let stand |

A walk may cross kinds, a block read leading to a command run. It ends with one line per change or decision, and where each is recorded.

## Code

**A walkthrough teaches; nothing changes unless the person asks.**

A block is a logical unit: a type, a function, a resource. Deeper means data flow, concurrency, error paths, and how the block joins the next; skip means one line and on. Line by line only on a block the person names, after a block pass left it unclear.

Dependency order:

1. types and constants
2. pure helpers
3. I/O and integrations
4. orchestration and wiring
5. tests, as what behavior they prove
6. deploy wiring, as what runtime it enables

A pull request is walked the same way over its diff.

Each block is cited by path and lines, then:

- what it does, in plain language;
- what breaks without it, concretely, or that nothing does and it should go;
- the simpler shape considered, or that none is.

Name where it sits, which layer or boundary, and whether it is standard use of a library or framework or this project's own choice. Expand an acronym the first time.

## Commands

**The person runs; the agent reads.**

### Whose step

A step is the person's when the agent lacks the credential, the change is shared or irreversible, or the permission classifier refused it. A refusal is handed over, never reworded past.

### First command

An identity check for whatever the steps touch: `aws sts get-caller-identity`, `gh auth status`, `kubectl config current-context`, `terraform workspace show`. It catches an expired session or a wrong context before either costs a step.

### Each turn

One command in a fence, ready to paste. Values the agent knows are filled in; one only the person knows, a secret aside, is asked once, then filled in. No `&&` chains: one output answers one action.

Then what it changes and what success prints, and stop. A paste that matches gets the next command; one that differs gets a diagnosis. A step in a web console goes the same way: one action, then what the page should show.

A change goes plan first: `terraform plan -out=tfplan`, then `terraform apply tfplan`. The last command proves the goal.

### Secrets

The agent never asks for one, prints one, or repeats one pasted. A command takes a secret from a prompt or a file, never its arguments: `gh secret set NAME` prompts. The person redacts before pasting; a secret that lands in chat anyway makes rotating it the next step.

### Recoveries

| Symptom | Command | Then |
|---|---|---|
| expired SSO: `ExpiredToken`, or "SSO session … has expired" | `aws sso login --profile PROFILE` | the identity check, then the failed command |
| state lock: "Error acquiring the state lock" and a lock ID | once the person confirms no other run, CI or a colleague's, holds it: `terraform force-unlock LOCK_ID` | the failed command |
| wrong kube context: the identity check names another cluster | `kubectl config use-context CONTEXT`, or `--context CONTEXT` on each command | the identity check |

## Questions

- Before each is put, its issue and the session's earlier answers are reread; one answered since, or whose answer changes nothing, is dropped.
- Each carries its issue, the question, options lettered, a recommendation, and the default its delegator takes on silence or a skip, so one word answers it: yes, a letter, skip.
- One issue's questions go together, issues ordered by what each unblocks.
- The answer is read back in one line at the head of the next turn, then recorded on its issue as a `Decision:` comment quoting the person's words once that reply lets it stand. An amendment or a rejection is read back alone and waits for a yes. A note or new question the person raises goes beside it, never into the decision; new work goes through [`sdlc-capture`](../sdlc-capture/SKILL.md).
- A side session started for the queue takes the [handoff](../sdlc/SKILL.md#handoff) it was given and reports its closing lines to whoever started it.
