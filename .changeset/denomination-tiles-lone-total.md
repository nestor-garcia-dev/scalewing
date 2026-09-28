---
'@scalewing/react': patch
---

`DenominationGrid`'s tiles layout shows a lone row's `total` (`docs/requests/teisoro-denomination-grid.md`, 2026-09-28 follow-up, Teisoro ENT-7). A grid with one row and no icon dropped the `total` it was given; the row's label line, with the label and the total, now shows whenever the row has a total. A lone row with neither an icon nor a total is unchanged.

No API change and no new dependencies.
