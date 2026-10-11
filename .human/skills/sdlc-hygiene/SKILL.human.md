Sweeps repositories for drift from `sdlc`, each stage reporting to the session.

## Precheck

Read the repositories in scope, the cadence, and each type's required fields. Pause without the `project` scope; stop with no repository.

## Sweep

A cheap `sdlc-sweep` agent per repository flags each drift by class. Stop on a repository it cannot read.

## Read

An `sdlc-family` agent per open Epic asks the project manager, its owner, what the family leaves open, proposing a direction. Stop on an Epic it cannot read.

## Act

Run `sdlc-setup.sh` and move stray cards; propose the rest, close nothing. Stop when GitHub refuses.

## Report

One comment of questions per Epic, one summary by class; pause while any wait.
