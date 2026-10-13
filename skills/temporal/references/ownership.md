# Ownership

A workflow executes in exactly one security context, its worker's owner. Every secret path, namespace, and access policy derives from that one identity.

## Act as the worker, or for a typed owner

A worker that serves one owner has it injected at startup, and its inputs carry none. A provisioning workflow takes a typed owner — a proto `oneof`, never a string or a string and a flag — and resolves it once at the top.

## A child workflow is mine; Nexus is someone else's

A child, left on the parent's task queue, runs on the caller's worker with the caller's credentials; never point one at another owner's queue. Reaching another owner's resources goes through a Nexus operation, the authorization and audit boundary, carrying only what may cross.

## Branch on structure, not labels

`issuer == nil` and "is this issuer mine?" make each variant follow from its data; `if kind == "tls"` scatters ownership assumptions across call sites. Share plain functions across security contexts, never a workflow type with an owner switch.

## Policies are generated from the methods that build the paths

In the same package, never assembled by hand elsewhere. Test it: change one path method and both the write and the policy rule move.
