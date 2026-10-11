Sweeps repositories for drift from `sdlc`.

## Precheck

Read the repositories, cadence and required fields. Pause without the `project` scope; stop with no repository.

## Sweep

A `sdlc-sweep` agent per repository flags drift by class.

## Read

An `sdlc-family` agent per open Epic asks its `owner` what the family leaves open.

## Act

Run `sdlc-setup.sh`, move stray cards, propose the rest. Close nothing.

## Report

A comment of questions per Epic, a count by class; pause while any wait.
