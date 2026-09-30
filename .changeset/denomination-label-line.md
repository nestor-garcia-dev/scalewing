---
'@scalewing/react': patch
---

`DenominationGrid` keeps a row's icon beside its label (`docs/requests/teisoro-denomination-grid.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375, DRW-28). A row's icon and words now sit in `.sw-denomination-label-line`, a flex row that does not wrap, in both layouts, so a long label wraps its words beside the icon instead of dropping them under it. Below `md` the strip no longer puts the icon on its own line over the label: the line stays a row, and the phone total keeps its own line under it. New generated class `sw-denomination-label-line`; no API change and no new dependencies.
