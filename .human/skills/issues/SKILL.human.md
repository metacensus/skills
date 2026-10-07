Three issue types across an organization, composed through GitHub's own links. Quarter-scale outcomes are Efforts on the roadmap, not issues.

## Jira → GitHub (minimal)

An Epic takes weeks and holds Tasks; a Task is one PR, what agents pick up; a Spike is a Task whose deliverable is a decision; a Bug is Task-sized. A Task that wants children is an Epic. Each assignee owns their issue's scope, with no separate decider. A Task files where its PR lands, unless the Epic's owner keeps it beside the Epic.

## Mechanisms (GitHub's words)

Type, parent/sub-issue, dependency, and labels for intake and drift only.

## Setup

A script turns issues on and creates the labels; the forms live once in the organization's `.github` repository.

## Filing

One form per type, plus Spike. Epics need goal and non-goals; Tasks need binary acceptance criteria and a verification command whose exit code settles done; Spikes need a question and its options; Bugs need observed and expected. The parent is linked after filing, never typed into the body.

## Triage

The parent's assignee swaps `needs-triage` for `agent-ready`, or comments what is missing.

## Picking up work

A ready Task is `agent-ready`, triaged, unassigned, unblocked, and carries its form's required fields; otherwise comment, do not start. Assigning, closing, or editing another's body is a proposal.

## Closing

Done differently is completed plus `deviated`; `reached-up` marks a Task that forced its parent's rewrite. A Spike closes once its decision is written where the work reads it.

## Linking an issue to its branch and PR

The PR closes the issue by number, across repositories when they differ; `checkin` names the branch.
