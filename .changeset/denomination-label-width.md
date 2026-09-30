---
'@scalewing/react': minor
---

`DenominationGrid` takes a `labelWidth` (`docs/requests/teisoro-denomination-grid.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375, DRW-27). `labelWidth?: number` is the strip's row-label column width in characters of the label type (`ch`), a positive integer. With it the strip takes the new generated class `sw-denomination-strip-aligned`: the row labels get that width and every count column one token width, so strips of the same width, columns and `labelWidth`, such as one per card in a feed, line their count columns up whatever their labels and counts (without totals the columns share spare width in proportion; with totals the total column takes it). A longer label wraps beside its icon; a longer single word or a wider count still widens its column. The tiles layout ignores it. Without `labelWidth` nothing changes. No new dependencies.
