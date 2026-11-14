How to write and operate Terraform.

## Done is an empty second plan

A plan right after an apply exits 0; anything that replans on its own is a bug.

## A root per blast radius

One state per environment, each root holding only its own credentials, cross-root reads checked by postconditions.

## One file names the environment

The backend file selects tfvars, environment, and context; a guard refuses any disagreement and any auto-loaded tfvars.

## Apply the plan that was reviewed

`plan -out`, then apply that file; never auto-approve.

## One source per version

Committed tool versions; modules state floors, roots lock; each tag lives once; images pinned; `_v1` resources only.

## A module's interface is its contract

Validations state consequences, preconditions check live state, shared labels are outputs, `depends_on` is rare.

## Know everything at plan time

Identifiers built from names, imports by the same names, server IDs looked up, CRDs installed first.

## Stateful things survive mistakes

Deletion protection on data and audit; create before destroy; audit logs retained and locked.

## Secrets stay out of state and logs

Provider-managed secrets, credentials stored alone, env credentials from Secrets, scripts that print no secret.

## Least privilege, stated in the trust

Immutable CI subjects, conditioned permissions, no wildcard roles.

## Kubernetes through Terraform

Policies by namespace, pod, and port; restarts on config change; kept, re-runnable setup Jobs.

## terraform test

Mocked providers, pinned randoms, a failure case per validation, properties over defaults, a reproducing test first.

## Teardown fails closed

Staged, re-runnable, refusing while anything remains.
