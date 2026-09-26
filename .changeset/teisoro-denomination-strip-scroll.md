---
'@scalewing/react': minor
---

A `DenominationGrid` `strip` wider than its container now scrolls sideways
inside its own region instead of widening the page (for example an
eleven-column strip on a 390 px phone, or a six-column strip inside an
outlined card inside another card). The region is a keyboard-focusable
`group` named after the grid's `label`, like `Table`'s scroll wrapper, and
the row label stays pinned at the start while the counts scroll under it.

New generated classes: `.sw-denomination-scroll` (the scroll region) and
`.sw-denomination-label-body` (the icon, label, and phone total inside the
row label cell). `Table` and the strip now share one generated scroll-region
rule; `.sw-table-wrap` output is unchanged. No prop changes. See
`docs/requests/teisoro-denomination-grid.md`.
