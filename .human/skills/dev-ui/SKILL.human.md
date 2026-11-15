> A web UI ships as its own image: one prefix, a static build, a build that gates content, and no more JavaScript than a page asks for.

Fires: scaffolding or reviewing a front-end repo's build config, base path, Dockerfile, web server config, or styling foundation; two UIs sharing tokens or components; aligning a surface to a design system.

```
Prefix ×3 → Static build → Build gate → Hydrate on ask → Share with sibling → Align to design system
```

CI and release: [`dev-ci-github`](../dev-ci-github/SKILL.human.md).

## One path, agreed three times

| Hop | Holds the prefix as | Example |
|---|---|---|
| Build | base | `base: '/app'` |
| Image | served directory | `/srv/app` under `/srv` |
| Proxy | route | `/app/*` |

Nothing strips it.

| Rule | Check |
|---|---|
| ✅ Artifact test | run the image; 200 from the base page and from one hashed asset it links |
| ✅ Internal links | built from the framework's base value, never a literal |
| ⚠️ Base value | may or may not end in `/`; check before appending |

## A static build, served small

| Concern | Rule |
|---|---|
| Output | render to files; add a server runtime only for what a file cannot answer |
| Image build | once, on `$BUILDPLATFORM`; architectures come from the runtime image |
| Server | Caddy `file_server`, `admin off`, `auto_https off`; the edge terminates TLS |
| Hashed assets | `Cache-Control: public, max-age=31536000, immutable` |
| HTML | not cached that way |
| Unknown path | 404 with the site's own page: `handle_errors` → `rewrite` → `file_server`; never the index with a 200 |
| Healthcheck | BusyBox `wget` of the base page |

## The build is the gate

| Checks | Excludes |
|---|---|
| content frontmatter against a schema · imports · types (`astro check`, `tsc --noEmit`) | drafts |

## Interactive only where a page asks

Page marks component → hydrates on visibility (`client:visible`), not load → calls the API same-origin through the proxy.

## Sharing with a sibling UI

| Rule | Why it matters |
|---|---|
| Match framework majors (React, Tailwind) | a component can move between UIs |
| No shared package until a second consumer exists | |
| A copy names its source file | an issue tracks swapping it for a published, versioned package |

## Aligning a surface to a design system

Set these first.

| Var | Is |
|---|---|
| `R` | base ref |
| `S` | surface's path |
| `P` | regex of hardcoded palette utilities, `(text\|bg\|border)-(gray\|slate\|…)-\d{2,3}` |
| `C` | design system's class prefix |

Flow: Baseline → Enumerate routes → Review 3 axes → Verify

1. Baseline from the base ref, never a remembered number; re-run before planning.

```bash
git grep -hPo "$P" $R -- "$S" | sort | uniq -c | sort -rn   # hardcoded palette, by frequency
git grep -lPo "$P" $R -- "$S" | wc -l                       # and by file count
git grep -lP "\b$C" $R -- "$S"                             # design-system classes already in use
git ls-tree -r --name-only $R | grep "$S"                   # the surface itself
```

- ⚠️ `git grep -E` ignores `\b` and returns zero hits that read as clean. Use `-P`.

2. Enumerate routes from the router, not the navigation; an unlinked page is still on the surface.
3. Review each page against the design system and the product's canonical copy, in code and in render; each hides defects the other shows.

| Axis | Looks at |
|---|---|
| Style | palette · type · spacing · components · light and dark · desktop and 375px |
| Messaging | copy that contradicts canon, is placeholder, or is stale |
| Nav | arrive · return · chrome matches neighbours |

Defects to find:

| Kind | Defect |
|---|---|
| Chrome | two nav or footer systems, chosen by layout route |
| Assets | one logo as a component here, a raster there |
| Theme | storage key scoped per surface, so it does not carry across pages |
| Palette | hardcoded, no theme can move it |
| Copy | placeholder in production, e.g. `(insert link)` |
| Errors | dead branch matching a string the API never returns |
| Forms | `<label>` without `htmlFor`; `<input>` without `id`; validation shown three ways |
| Load | visibility-gated content first on screen, page opens blank |
| Mobile | a screen of prose above a form in a split layout |
| Links | relative `href` resolving only from the current path; nav link to the current page; orphan route reachable only by URL |

4. Verify:

| Check | How |
|---|---|
| Which tree the dev server serves | fetch a module only the branch has and one only the base has; exactly one returns JavaScript, the other the SPA fallback; a shell's directory can revert between commands |
| Styling | `getComputedStyle` on a representative element; screenshots break when scrolled programmatically |
| Chrome parity | walk routes with `pushState`; system's root, nav, footer present, old ones absent |
| Dormant page behind a guard | lift the guard, then restore and grep-confirm |
| ⚠️ The gate | sees structure, never appearance; CI may not run tests, so run them locally and look at the render |
