> A UI test runs at the lowest layer that can fail for its reason; every route meets axe in a real browser.

Fires: writing front-end tests; a browser suite or accessibility check; smoke-testing a UI image.

Layer → Routes → Keyboard → Image → SSR → Contrast → Harness

## Choose the layer by what a failure would mean

| Layer | Catches |
|---|---|
| Logic | a wrong result; golden state-machine fixture |
| DOM | markup, labels, each form state |
| Browser | layout, hydration, focus, CSP, colour |
| Artifact | what the shipped image answers |

⚠️ A render to a string is not a DOM test.

## Every route in a real browser

axe on every globbed route, light and dark, open dialogs and form states included; any WCAG 2.2 A or AA violation fails. ⚠️ Not jsdom; a gap is one rule's `test.fail()` naming its issue, never an allow-list.

## Keyboard paths are tests

✅ Tab in order with focus visible · Escape returns focus · Enter submits.

## Probe the image as built

Base page, deep link, hashed asset, missing asset 404, unknown path 404, headers, `robots.txt`, healthcheck.

## A package renders without a browser

The built package renders with browser globals as throwing getters.

## Contrast is computed from the tokens

✅ 4.5:1 for text, 3:1 for the rest, from `light-dark()` pairs. ⚠️ A role in no pair fails.

## One harness

One shared Playwright preset against the build, third parties blocked; `make test` · `test-browser` · `test-artifact`. ⚠️ No hand-built runner, no machine-local browser path.
