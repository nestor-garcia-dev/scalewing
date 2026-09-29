---
'@scalewing/react': patch
---

A lone `DenominationGrid` tiles row without an icon or `total`, whose `label` is the grid's own `label`, no longer names itself (`docs/requests/teisoro-denomination-grid.md`, 2026-09-28 lone-row name follow-up, Teisoro SDAY-31). It was a region with the grid's own words inside the grid's group; now the group, named by `label`, is its only name. Every other row, including a lone plain row with different words, is still a region named by its `label`. No API change and no new dependencies.
