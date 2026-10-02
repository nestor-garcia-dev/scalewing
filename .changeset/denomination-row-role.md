---
'@scalewing/react': minor
---

`DenominationGrid` `rowRole` (`docs/requests/teisoro-denomination-grid.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, CHG-4): `rowRole?: 'region' | 'group'`, default `'region'`. At `'group'` each named tiles row keeps its `aria-label` but is a `group`, not a landmark region, so a page with many grids does not list a region per row. The default keeps today's regions; the strip ignores the prop; an unknown value throws a `RangeError`. New exported type `DenominationGridRowRole`. No new dependencies.
