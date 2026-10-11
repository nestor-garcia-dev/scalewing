---
'@scalewing/react': minor
---

`MultiSelect` (with `MultiSelectProps`, `MultiSelectOption` and `MultiSelectAlign`): several choices from a short list behind one trigger (`docs/requests/teisoro-multi-select.md`, Teisoro F-011 release R3).

- `label`, `options` (`{ value, label, icon?, separatorBefore? }`), `value`, `onChange` (checked values in the options' order), `allLabel`, `clearLabel`, `summary` (the trigger's words), `disabled`, `align`.
- A disclosure: a button with `aria-expanded` showing a group of native checkboxes, with All and Clear, on the popover layer beside the trigger; focus moves to the first checkbox, Escape returns it to the trigger, and focus or a press outside closes the panel.
- Blank words, no or duplicate options, an unknown value or `align` throw a `RangeError`.
- New generated `sw-multi-select-*` classes; the panel joins the popup layer in `css/stacking.ts`. No new tokens or dependencies.
