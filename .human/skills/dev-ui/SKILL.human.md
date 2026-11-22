> What every web UI shares; a child skill holds the rest.

Fires: a front-end repo's build config, base path, Dockerfile, styling, dependencies, API calls or a form's submit; two UIs sharing; design-system alignment; any work for a child.

|Skill|Holds|
|---|---|
|`dev-ui`|what every UI shares|
|[`dev-ui-astro`](../dev-ui-astro/SKILL.human.md)|static sites|
|[`dev-ui-react`](../dev-ui-react/SKILL.human.md)|React apps and plugins|
|[`dev-ui-testing`](../dev-ui-testing/SKILL.human.md)|testing a UI|
|[`dev-ci-github`](../dev-ci-github/SKILL.human.md)|CI and release|

```
Image → Base path → Headers → Tokens → Versions → Clients → Forms → Build gate → Align
```

## One image, every environment

Static files behind Caddy, one image promoted everywhere, the API same-origin. ✅ Digest-pinned, non-root, smoke-tested as built.

## One base path

`ARG BASE` once; build, `/srv${BASE}`, healthcheck and Caddyfile read it. ⚠️ Nothing strips it; no literal links.

## Caching and headers

Hashed assets `immutable`, shell `no-cache`. ⚠️ A missing chunk is a 404, never HTML. CSP and security headers from the image; `robots.txt` per host.

## Tokens from one source

Components read semantic roles; `light-dark()` with a pre-paint script. ⚠️ No hex, palette utility, built class name or second palette. ✅ Contrast asserted; fonts self-hosted; Tailwind 4.

## One version line

One version per package and framework major, bumped together. ⚠️ No forks; a shared file comes from a workflow or package, never a copy.

## Generated clients only

One session seam over the generated client. ⚠️ No raw `fetch` writes or hand-written wire types. ✅ Schema-checked at every boundary.

## Submitting a form

Through the seam's timeout; a synchronous guard against double submit. ✅ `aria-busy`, status or alert focused, input kept.

## The build is the gate

Schemas, links, route inventory, private hosts, types.

## Aligning a surface to a design system

```
Baseline → Enumerate routes → Review → Verify
```

1. Baseline the hardcoded palette from the base ref. ⚠️ `git grep -E` ignores `\b`; use `-P`.
2. Enumerate routes from the router, not the navigation.
3. Review style, messaging, nav.
4. Verify with `getComputedStyle`. ⚠️ The gate sees structure, never appearance.
