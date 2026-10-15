---
'@scalewing/react': minor
---

`Dialog` gets three options:

- `status` (a line beside the actions, in the footer's polite live region);
- `canvas="grouped"` (`ThemeCanvas`; the grouped canvas grey fill, solid, so cards stand apart);
- `sheetGrabber` (a decorative grabber on the bottom sheet; needs `sheetBelow`).

An `ActionBar` or `Dialog` `summary` whose `value` is empty no longer throws. It means there is no figure yet: the line is left out and the live region stays, so the first figure is still announced.

New classes: `sw-dialog-footer-note`, `sw-dialog-canvas-grouped`, `sw-dialog-grabber` and `sw-dialog-has-grabber`. New stacking layer `sheetGrabber`. No new tokens or dependencies. Request: `docs/requests/teisoro-dialog-board.md`.
