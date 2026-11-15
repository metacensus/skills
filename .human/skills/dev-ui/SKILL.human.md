> A web UI ships as its own image: one prefix, a static build, a build that gates content, and no more JavaScript than a page asks for.

Fires: scaffolding or reviewing a front-end repo's build config, base path, Dockerfile, or styling; two UIs sharing components; design-system alignment.

```
Prefix ×3 → Static build → Build gate → Hydrate on ask → Share → Align
```

CI: [`dev-ci-github`](../dev-ci-github/SKILL.human.md).

## One path, agreed three times

| Build | Image | Proxy |
|---|---|---|
| base `/app` | `/srv/app` | `/app/*` |

✅ Artifact test: 200 from the base page and one hashed asset.

## A static build, served small

Files; a runtime only where a file cannot answer. Caddy `file_server`; hashed assets `immutable`. ⚠️ An unknown path is a 404, never the index with a 200.

## The build is the gate

Frontmatter schemas, imports, types; drafts excluded.

## Interactive only where a page asks

Hydrate on visibility; call the API same-origin.

## Sharing with a sibling UI

Match framework majors; share no package until a second consumer exists.

## Aligning a surface to a design system

```
Baseline → Enumerate routes → Review → Verify
```

1. Baseline the hardcoded palette from the base ref. ⚠️ `git grep -E` ignores `\b`; use `-P`.
2. Enumerate routes from the router, not the navigation.
3. Review style, messaging, nav.
4. Verify with `getComputedStyle`. ⚠️ The gate sees structure, never appearance.
