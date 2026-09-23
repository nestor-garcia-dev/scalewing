---
'@scalewing/react': patch
---

An open `Select`, `ActionMenu` or `Tooltip` inside a glass `Card` or an
`Accordion` now paints over the surface below it (see
`docs/requests/teisoro-popup-stacking.md`). Backdrop blur makes each glass
surface its own stacking context, so the open list painted under the next card
and a click on a covered option reached that card's field instead. No prop
changes.
