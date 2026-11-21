---
name: operator-runbook
description: Walk a person through steps only their hands run, one command per turn, each checked against its pasted output. Trigger on `terraform apply`; a change in AWS, Cloudflare or DNS; registering a GitHub App; `gh secret set`; and anything the permission classifier refuses.
---

**The person runs; the agent reads.**

## Whose step

A step is the person's when the agent lacks the credential, the change is shared or irreversible, or the permission classifier refused it. A refusal is handed over, never reworded past.

## First command

An identity check for whatever the steps touch: `aws sts get-caller-identity`, `kubectl config current-context`, `terraform workspace show`. It catches an expired session or a wrong context before either costs a step.

## Each turn

One command in a fence, ready to paste. Values the agent knows are filled in; one only the person knows is asked once, then filled in. No `&&` chains: one output answers one action.

Then what it changes and what success prints, and stop. A paste that matches gets the next command; one that differs gets a diagnosis.

A change goes plan first: `terraform plan -out=tfplan`, then `terraform apply tfplan`.

## Secrets

The agent never asks for one, prints one, or repeats one pasted. A command takes a secret from a prompt or a file, never its arguments: `gh secret set NAME` prompts. The person redacts before pasting; a secret that lands in chat anyway makes rotating it the next step.

## Recoveries

| Symptom | Command | Then |
|---|---|---|
| expired SSO: `ExpiredToken`, or "SSO session … has expired" | `aws sso login --profile PROFILE` | the identity check, then the failed command |
| state lock: "Error acquiring the state lock" and a lock ID | once the person confirms no other run, CI or a colleague's, holds it: `terraform force-unlock LOCK_ID` | the failed command |
| wrong kube context: the identity check names another cluster | `kubectl config use-context CONTEXT`, or `--context CONTEXT` on each command | the identity check |

## Done

A last command proving the goal, then one line per change made.
