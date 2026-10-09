---
'@scalewing/react': minor
---

`DenominationGrid` shows its `totalLabel` (`docs/requests/teisoro-denomination-grid.md`, 2026-10-08 follow-up, Teisoro F-006-S11, HIS-11). The strip's total column header, which was visually hidden at every width, now shows the label over the totals from md up, in the column heads' style (`sw-denomination-head`), its end on theirs. Below md it stays visually hidden with the column, as each total sits under its row's label there. A strip without `totalLabel` keeps its empty corner. The label's span is now `sw-denomination-total-label` (was `sw-sr-only`). New generated class `sw-denomination-total-label`. No API change and no new dependencies.
