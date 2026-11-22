> A signed-out public surface goes live once every item holds, each by the strongest proof it allows.

Fires: a public site, blog or form about to go live; a domain cutover; "is this ready?"

```
Gate test → Staging request → Person → Counsel → Report: pass · fail · escalate
```

⚠️ Rules that held for one launch, not legal advice; open questions go to counsel.

| Item | Rule | Proof |
|---|---|---|
| Headers | `nosniff`, referrer, permissions, `frame-ancestors 'none'`; HSTS a year, `preload` once all subdomains serve HTTPS; cache by asset kind | image test: `/`, unknown path |
| Canonical host | one origin in config; `rel=canonical`, `og:url` derived; apex redirects; unique titles | build test |
| Robots and sitemap | canonical `Host` allows; any other `Disallow: /` | image test, both hosts |
| Favicons | ico, touch, 192/512, manifest; no production path 404s | image test |
| Private links | public-repo allow list; no internal hosts | build test |
| Accessibility | axe at [`dev-ui-testing`'s floor](../dev-ui-testing/SKILL.human.md#every-route-in-a-real-browser); skip link; heading order | gate + 🩷 browser for contrast |
| Privacy notice | per form; each statement traced to code | 🩷 person |
| Copy compliance | tax status pinned; asks flagged off; careers, consent, license | tests + ⛔ counsel |
| Domain | DMARC at least `p=none`; CAA | `dig` |
| Visual pass | every route: 375px, dark, print, links, forms | 🩷 person |
| Staging after merge | image tests as `curl` on staging, then production | output |
