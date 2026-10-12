---
'@scalewing/react': minor
---

A whole-row press for a table row's one action, such as a search result that is picked (`docs/requests/teisoro-table-row-press.md`, Teisoro F-011 task 2185):

- `TableRow pressable` (opt-in): a plain primary pointer press anywhere on the row activates the row's first link or button. A press with a modifier key, on another control in the row, already handled, or ending a text selection is left alone, as is a row whose action is disabled. The row is not a control (no role, no tab stop): keyboard and screen reader users use the action itself. The row takes the pointer cursor and the quiet fill while hovered, pressed, or while its action has keyboard focus (an outline in `Highlight` under forced colours), and underlines its action on hover.
- `TableCell onPress` (a body cell or a row header): the cell's children become a button in the cell's own text style at weight 600, underlined on hover and focus, for the row's action. A non-function value or one on a sortable header throws a `TypeError`.

New generated classes `sw-table-row-press` and `sw-table-action`. No new tokens, no new dependency.
