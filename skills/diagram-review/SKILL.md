---
name: diagram-review
description: Iterate a figure (architecture, sequence, before/after) to done — render, screenshot, apply grid-snap and uniform-box rules, re-host, compare before and after, export SVG. Trigger when drawing, revising or reviewing a diagram or figure, and when a person corrects a diagram's layout.
---

**Every round applies every rule to the whole figure, not only the defect a person named.**

```
Render → Screenshot → Rules → Re-host → Compare → Done? ─no→ Render
                                                  └─yes→ Export SVG
```

## Render

The source is SVG with explicit coordinates. A figure from a layout engine is exported to SVG once, then edited as SVG. It is rendered in a browser at the size it is read.

## Screenshot

At that size, in each theme the host shows. Rules are judged on the screenshot, not the source: overflow and overlap show only when rendered.

## Grid snap

- One grid unit per figure, 8 px unless the host sets one. Every box's x, y, width and height is a whole number of units.
- Boxes in a row share a top edge; boxes in a column share a centre line.
- Gaps between neighbours are equal within a row or column.
- Connectors run straight or at right angles along grid lines, end at an edge's midpoint (or at even spacing when several meet one edge), never cross a box, and cross each other only where no placement avoids it.
- Sequence figures: lifelines at one pitch, messages at one row pitch, in time order.

## Uniform boxes

- Each box has a kind: a service, a store, an actor. Boxes of one kind share width, height, corner radius, stroke, fill and font size.
- A kind's size is its longest label plus one padding. A label that does not fit is shortened or wrapped; its box never grows alone.
- Labels are centred, in one font family. A connector's label sits at its midpoint, clear of the line.
- More than one kind gets a legend.
- Before/after figures: both panels share frame and scale, and an element unchanged between them sits at the same coordinates in both, so only the change differs.

## Re-host

Republish where the person views it, at the same link, replacing the last round.

## Compare

Before and after screenshots side by side, each change listed in a line. A change not intended is reverted before the round ends.

## Done

The loop ends when one round's screenshot breaks no rule, its compare shows only intended changes, and the person accepts the re-hosted figure.

A correction from the person starts a round. One that is a rule, not content, applies to every element it reaches and joins the rules for later rounds.

Two rounds that move the same element back and forth mean two rules conflict: ask the person which yields, rather than run a third.

## Export

The accepted figure as one standalone SVG: whole-number coordinates, styles inline, text kept as text, no embedded raster.
