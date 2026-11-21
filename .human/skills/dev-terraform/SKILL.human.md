> Done is an empty second plan: each root owns one environment's state, applies only the plan a person read, and keeps stateful things and secrets safe from mistakes.

Fires: writing or reviewing `.tf`, `.tftest.hcl` or `.tfvars`; before any plan, apply, import or destroy.

## Done is an empty second plan

A plan right after an apply exits 0; anything that replans on its own is a bug.

## A root per blast radius

One state per environment, each root holding only its own credentials, cross-root reads checked by postconditions.

## One file names the environment

The backend file selects tfvars, environment, and context; a guard refuses any disagreement and, in a shared environment's run, any auto-loaded tfvars.

## Apply the plan that was reviewed

`plan -out`, then apply that file; never auto-approve. The plan file holds secrets and outlives no apply.

A person runs each apply; drift shows in the next plan and is settled before that apply. No scheduled plan.

## One source per version

Committed tool versions; modules state floors, roots lock; each tag lives once; images pinned; one generation of each resource type.

## A module's interface is its contract

Validations state consequences, preconditions check live state, shared labels are outputs, `depends_on` is rare.

## Know everything at plan time

Identifiers built from names, imports by the same names, server IDs looked up, CRDs installed first.

## Stateful things survive mistakes

Provider deletion protection on data and audit, `prevent_destroy` where none exists; create before destroy; renames through `moved`; audit logs retained and locked.

## Secrets stay out of state and logs

Provider-managed secrets, credentials stored alone, env credentials from Secrets, scripts that print no secret.

## Least privilege, stated in the trust

Immutable CI subjects, conditioned permissions, no wildcard roles, IMDSv2 required.

## Kubernetes through Terraform

Policies by namespace, pod, and port; restarts on config change; kept, re-runnable setup Jobs.

## terraform test

Mocked providers, pinned randoms, a failure case per validation, properties over defaults, a reproducing test first, mutants to prove the tests.

## Teardown fails closed

Staged, re-runnable, refusing while anything remains.
