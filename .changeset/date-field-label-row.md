---
'@scalewing/react': patch
---

`DateField`'s label row matches `Field`'s (`docs/requests/teisoro-date-field.md`, 2026-09-28 label row follow-up, Teisoro NSF-35). Its label now uses `Field`'s own label markup (the label words as a `Text` label span and the `aria-hidden` required mark, inside a `<label>` that keeps the canvas type), so a `DateField` beside a `Field` lines up at the label and the control; before, its entry sat 5 px higher. `.sw-date-field-label` no longer sets its own font size, weight or line height. No API change and no new dependencies.
