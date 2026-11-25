---
name: launch-review
description: How to review a public site, blog or form before it goes live — headers, canonical host, robots and sitemap, accessibility, privacy, copy, domain records, a visual pass, staging. Trigger before such a surface goes live, before a domain cutover moves it to new builds, and when asked whether it is ready.
---

The surface is what a signed-out visitor reaches; the signed-in app and a full security review are out.

Each item is held by the strongest proof it allows: a test the build or image gate runs, then a request against staging after merge, then a person, then counsel. An item no test holds says why.

These are rules that held for one launch, not legal advice; each open question goes to counsel.

## Headers

Every response carries them, the 404 included.

- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy` denying every feature no page uses, and CSP `frame-ancestors 'none'`.
- **HSTS for a year**, with `includeSubDomains; preload` only once every subdomain serves HTTPS. The canonical host's HSTS covers only its own subdomains, so the apex's redirect sends it too. Submitting to the preload list is a person's call, after legacy hosts retire.
- **Cache lifetimes**: hashed assets as [`dev-ui`](../dev-ui/SKILL.md) sets them, other static files a week, HTML and error pages `no-cache`.
- **Proof**: an image test requests `/` and an unknown path and asserts each header.

## Canonical host

- **The origin is set once in config** (`https://www.example.org`). Each page's `rel=canonical` and `og:url` derive from it and the path, with the trailing slash the server redirects to; the 404 names none.
- The apex redirects to the canonical host.
- Each page has its own `<title>`.
- **Proof**: a build test over every built page.

## Robots and sitemap

- **`robots.txt` answers by `Host`**: the canonical host allows crawling and names every sitemap under it, one per service sharing the host; any other host gets `Disallow: /`, so a new environment fails closed.
- Sitemaps list HTML pages at absolute URLs, never the 404.
- **Proof**: an image test requests `robots.txt` with the canonical `Host` and with another.

## Favicons

- `favicon.ico` at 16, 32 and 48 px, an `apple-touch-icon` on an opaque tile, and 192 and 512 px PNGs named by a web manifest, all rendered at build from the design system's mark.
- No path today's production serves returns 404 on the new build.
- **Proof**: an image test requires each path, production's included.

## Private links

- **The build fails on a link to an organization repository missing from its public list**, or to an internal host. The list allows rather than denies, so it fails closed and publishes nothing private; refresh it with `gh repo list ORG --visibility public`.
- Page copy is public even when its repository is not, so [`open-source`](../open-source/SKILL.md)'s leads apply to it.
- **Proof**: a build test over every built `<a href>`.

## Accessibility

- **axe over every built page**, at [`dev-ui-testing`'s floor](../dev-ui-testing/SKILL.md#every-route-in-a-real-browser).
- A skip link, shown on focus, targets `<main id="main">`; headings nest without skipping a level.
- **Proof**: the gate, plus one browser run for contrast, light and dark, with hidden sections shown, since jsdom lays nothing out.

## Privacy notice

- **One per form**, stating what it collects, where that goes, what the servers log, how long each is kept, who processes it, cookies and storage, how to be removed, how changes are announced, and a contact address that receives mail.
- Each statement traces to the code or config that makes it true.
- Linked from every footer and beside each form's submit.
- **Proof**: a person, statement by statement, since no test reads a sentence against the code.

## Copy compliance

- **Tax status** is stated as it stands, from one constant a test pins.
- **Any ask for money** sits behind one flag, off until counsel settles solicitation registration, and a test asserts no built page asks while it is off.
- **Careers**: an unpaid role promises no later pay, reads as volunteering rather than employment, and prefers no protected class; a paid role states its range.
- Each person shown has consented in writing.
- Claims match what ships.
- Footers name the text's license.
- **Proof**: a test wherever a sentence or flag can be pinned; counsel for the rest.

## Domain

- DMARC at least at `p=none`, reporting to a mailbox that exists, so its reports show when `quarantine` is safe.
- CAA names only the CAs that issue for the domain.
- **Proof**: `dig TXT _dmarc.example.org` and `dig CAA example.org`.

## Visual pass

- **A person walks every route on staging**, enumerated as [`dev-ui`](../dev-ui/SKILL.md#aligning-a-surface-to-a-design-system) does: desktop and 375px, light and dark, print, every link followed and every form sent.
- Each finding is fixed or filed.
- **Proof**: the person's sign-off.

## Staging after merge

- **Each image test re-runs as requests against staging** (`curl -sI`, `-H 'Host: …'`), since staging, not CI's container, is what the switch promotes; then against production after the switch.
- **Proof**: the requests' output.

## Report

One row per item: its proof, and pass, fail or escalate. Under an issue, it takes [the hub's stage-comment format](../sdlc/SKILL.md#stages).
