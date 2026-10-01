Three issue types across an organization, composed through GitHub's own links. Quarter-scale outcomes are Efforts on the roadmap, not issues.

## Jira → GitHub (minimal)

An Epic takes weeks and holds Tasks; a Task is one PR, what agents pick up; a Bug is Task-sized. A Task that wants children is an Epic. Each assignee owns their issue's scope, with no separate decider.

## Mechanisms (GitHub's words)

Type, parent/sub-issue, dependency, and labels for intake and drift only.

## Filing

One form per type. Epics need goal and non-goals; Tasks need binary acceptance criteria and a verification command whose exit code settles done; Bugs need observed and expected.

## Picking up work

A ready Task is `agent-ready`, triaged, unassigned, unblocked, and carries criteria and verification; otherwise comment, do not start. Assigning, closing, or editing another's body is a proposal.

## Closing

Done differently is completed plus `deviated`; `reached-up` marks a Task that forced its parent's rewrite.

## Linking an issue to its branch and PR

The PR closes the issue by number; `checkin` names the branch.
