---
'@scalewing/react': minor
---

`requiredMark` (`RequiredMark`, `requiredMarks`) on `Field`, `Select`, `DateField`, `Combobox` and `FilterChips`: `'visible'` (default, unchanged) or `'hidden'`, which leaves out the label's `aria-hidden` " \*" while the control stays required (native `required` or `aria-required`) (`docs/requests/teisoro-required-mark.md`, Teisoro F-011 release R6). An unknown value throws a `RangeError`. No new classes, tokens or dependencies.
