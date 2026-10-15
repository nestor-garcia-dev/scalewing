---
'@scalewing/react': minor
---

`FilterChips` gains four opt-in options: `labelVisuallyHidden` (the label stays the group's name, not drawn); `countAppearance="inline"` (`FilterChipCountAppearance`, `filterChipCountAppearances`; default `figure`), the count in the chip's words after a hidden middle dot; `overflow="scroll"` (`FilterChipsOverflow`, `filterChipsOverflows`; default `wrap`), one row that scrolls sideways inside its own box; and `multiple` with a `value` list and `onChange(values)`, each chip a checkbox and its own Tab stop (a multiple group cannot be `required`). Unknown values, a multiple value that is not a list or holds a value that is no option, and `required` with `multiple` throw a `RangeError`. New classes `sw-filter-chip-count-inline` and `sw-filter-chips-scroll`; no new tokens or dependencies. Request: `docs/requests/teisoro-filter-chips-board.md`.
