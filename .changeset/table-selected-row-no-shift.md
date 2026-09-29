---
'@scalewing/react': patch
---

`TableRow selected` marks the row without moving a column (`docs/requests/teisoro-table.md`, 2026-09-28 follow-up, Teisoro NSF-12). The first cell no longer gains `padding-inline-start` and the 8 px dot is gone. A 4 px accent bar at the row's inline start (3:1 or more against the page and the surface) is drawn inside the first cell's padding, out of flow; it follows the writing direction. The row takes no fill, so text, muted and accent text keep their contrast. Forced colors keep the bar in `Highlight`. No API change and no new dependencies.
