Sweeps repositories for drift from `sdlc`.

## Precheck

Read the repositories, cadence and required fields, asking the user for the mapping when none is found. Escalate without the `project` scope; stop with no repository.

## Sweep

A `sdlc-sweep` agent per repository flags drift by class; escalate on a short read.

## Read

An `sdlc-family` agent per open Epic asks its `owner` what the family leaves open.

## Act

Run `sdlc-setup.sh`, move stray cards but no parent's, adding none, propose the rest, misparented to the parent's owner, ask the `lead` about root issues. Close nothing.

## Report

A `Read: escalate` comment of questions per Epic, a count by class; escalate while any wait.
