---
name: dev-terraform
description: How to write and operate Terraform — roots and state, one source per version, module interfaces, plan-time knowability, stateful lifecycle, secrets kept out of state and logs, least privilege, Kubernetes through Terraform, and terraform test. Trigger when writing, reviewing, or planning Terraform or OpenTofu code, a module, a root, a backend or environment layout, a terraform test, or the Makefile and scripts that run them.
---

## Done is an empty second plan

A change is finished when `terraform plan -detailed-exitcode` exits 0 right after the apply. Anything that plans again on its own — a perpetual diff, a TTL-deleted Job, a server-side default — is a bug, fixed at its cause, commented where it is fixed, and pinned by a test.

## A root per blast radius

- **One state per environment.** Staging work never shares a lock, a plan, or an apply with production. Cluster-wide pieces live in one root, each environment's workloads in another, never both in one state reached by `-target`, which is for recovery, not routine deploys.
- **A root needs only the credentials of what it manages.** A piece that needs another provider's credentials lives in that provider's root and hands its result over, so a local or test run of this root needs none — and a test fails if this root's lock file ever gains that provider.
- **A cross-root read checks what it got.** `terraform_remote_state` carries a `lifecycle.postcondition` whose message names the command that fixes it, and the consumer types the payload as a strict object.
- **A handshake across roots hashes what was applied**, the applied resource's attribute, never the local file it came from, so a failed apply cannot publish the new value.

## One file names the environment

- **The backend file selects everything else.** `envs/<env>.s3.tfbackend` derives the tfvars file, `var.environment`, and the kube context.
- **A guard refuses before anything runs** when they disagree: a state key other than `<root>/<env>.tfstate`, the wrong kube context, or any `terraform.tfvars` or `*.auto.tfvars`, which every run — `terraform test` included — loads silently. Per-environment values go in `envs/<env>.tfvars`, personal ones in `TF_VAR_*`.
- **The guard runs in every mode.** A run with no backend configured refuses a production context outright rather than skipping the check.

## Apply the plan that was reviewed

`plan -out=tfplan`, then `apply tfplan`. Never `-auto-approve` a fresh plan. Every root applies the same way; a root that prompts while another auto-approves trains operators to stop reading.

**Hole:** where applies run (a laptop or CI against real state) and how drift is detected.

## One source per version

- **Terraform and tflint versions come from committed files** (`.terraform-version`, `.tflint-version`), read by make and CI; a run whose version reads empty refuses to start.
- **Modules declare floors, roots lock.** A reusable module states `>=` for Terraform and each provider; only a root pins, through its committed `.terraform.lock.hcl`, and tests run under that lock. A module's `required_version` floor covers every feature its tests use — `mock_provider` needs 1.7.
- **Each image tag and chart version lives once, in the root.** A module default that duplicates it, or a script that hard-codes it, drifts. A value make or a script reads out of HCL is pinned by a test that fails when it moves.
- **Images are pinned to immutable tags.** A moving tag runs only with `image_pull_policy = "Always"`, and a test keeps it out of production.
- **One generation of each resource type.** Use the `_v1` Kubernetes resources only; never mix `kubernetes_deployment` and `kubernetes_deployment_v1`.

## A module's interface is its contract

- **Validation states the invariant and the consequence**: "an empty pod_selector would admit the proxies to every pod". Cross-variable validation names the offending key. Validations mirror what the workload refuses at start, so a bad value fails at plan, not in a crashloop.
- **Preconditions check live state** a variable describes — a StorageClass's reclaim policy against the stated one.
- **Anything another module must match is an output.** Labels, namespace names, and selectors a caller must carry are exported, never repeated as string literals in two modules.
- **No dead inputs.** An attribute the module ignores is removed; tflint cannot see unused object attributes.
- **Swappable implementations share one output type.** Each profile module emits the same typed object; the root selects with `count` and `one(module.x[*].out)`.
- **`depends_on` only for edges Terraform cannot see**, each with a comment. Never on a module that reads data sources: it defers every read to apply.

## Know everything at plan time

- **Build identifiers from names, not attributes.** ARNs in policies are composed from names in `locals`, so policies render at plan; a test overrides the attribute and asserts it appears nowhere.
- **Adopt hand-made resources with `import` blocks** that use the same `locals` name as the resource.
- **Server-assigned IDs are looked up, not hard-coded.** A data source lists them and a small pure module matches each managed object independently, so an unmanaged neighbour never breaks the plan.
- **CRDs a `kubernetes_manifest` needs are installed before plan**, out of band, from versions single-sourced with the charts.

## Stateful things survive mistakes

- **Anything holding data, an audit trail, or an address referenced outside the repository** gets `prevent_destroy` or the provider's deletion protection, and the variable's description names the command that unlocks it.
- **Replaceable things replace before destroying**: `name_prefix` plus `create_before_destroy` on node groups, parameter groups, and content-hashed ConfigMaps.
- **`replace_triggered_by` where a binding follows an instance**, not a name — an access entry bound to a role's unique ID.
- **Pin only the version that must not move.** A managed database takes its major version, so automatic minor upgrades never plan a downgrade.
- **Audit logs are versioned, retained for a stated period, and locked** against deletion.

## Secrets stay out of state and logs

- **Prefer provider-managed secrets** (`manage_master_user_password`) so the value never enters state; old state versions expire, because they hold whatever did.
- **A credential is stored alone and composed at runtime**: `DATABASE_PASSWORD` from a Secret, then `DATABASE_URL` built from `$(DATABASE_PASSWORD)`.
- **An env var named like a credential comes from a Secret**, never a literal `value`, and a test walks every container to hold it.
- **Scripts read single fields** (`-field=username`), never print a whole credential response; kept Job logs ship to the log store. A lint enforces it, and an exemption carries `# lint: allow <reason>`.
- **Generated passwords substituted unencoded into a URL** use `special = false`.
- **Shell lives in `.sh` or `.tftpl` files**, not heredocs, so shellcheck and the lint can read it.

## Least privilege, stated in the trust

- **CI trust pins the immutable subject** (`repo:<owner>@<id>/<repo>@<id>`), the audience, and the ref, validated by regex; two roles a workflow can assume differ by a claim (`job_workflow_ref`, `environment`), never share one subject.
- **A permission split by resource carries the condition each needs** — instances by tag, documents by name.
- **No wildcard roles.** A `*/*/*` ClusterRole or a policy that can rewrite its own ACLs is root by another name.
- **IMDS hop limit 1** keeps pods off the node's role.

## Kubernetes through Terraform

- **NetworkPolicy admits by namespace and pod and port**: the namespace by the API-set `kubernetes.io/metadata.name` label, AND a pod label, on named ports. Default-deny is one shared module, tested once.
- **A pod restarts when a file it reads at start changes**: a checksum annotation, or a content hash in the ConfigMap's name. Never `sub_path` for a file that changes; it never refreshes.
- **Certificates renew before expiry**: `early_renewal_hours` on every leaf.
- **Selector labels are separate from labels** and never carry a version; selectors are immutable.
- **Setup Jobs are kept** — no `ttl_seconds_after_finished`, or the next plan recreates them — and are re-runnable: describe before create, tolerate only the specific duplicate error, start workflows with a fixed ID. The version they set up is in the Job's name.
- **A restart-only role** is a per-Deployment Role plus a ValidatingAdmissionPolicy admitting only the `restartedAt` change.

## terraform test

- **`mock_provider` by default**; the real provider with fake credentials only where rendering needs it (`aws_iam_policy_document`), with every remote call overridden.
- **`command = apply` to reach computed values**, and `override_resource` to pin random values so a test asserts the literal appears in no pod spec, ConfigMap, or output.
- **Every validation has an `expect_failures` run**; fixtures for malformed inputs live in their own file.
- **Run names are sentences and `error_message` says why**, so a failure reads as the broken rule.
- **Assert properties, not defaults.** A test that restates a default is a change detector. Prefer a structured output over regex-parsing HCL.
- **Tests hold repository invariants** too: production never on a moving tag, roots agree on the state bucket, a root's lock never gains a provider.
- **A bug fix starts with a commit whose test reproduces it.**
- **Offline checks use their own `TF_DATA_DIR`**, so an initialized remote backend never makes `validate` or `test` need credentials. CI runs them through `make`, per dev-ci-github.

## Teardown fails closed

Teardown is a staged, re-runnable make target: delete in the order controllers need to clean up what they made, wait on everything, and refuse to delete a CRD while any instance of it remains. A README runbook that an operator must follow by hand marks a step not yet automated.
