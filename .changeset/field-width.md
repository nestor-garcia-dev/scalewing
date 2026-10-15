---
'@scalewing/react': minor
---

`Field` `width` (`FieldWidth`, `fieldWidths`: `xs` 4rem, `sm` 6rem, `md` 8rem, `lg` 12rem, `xl` 16rem, the Table column sizes): caps the control (or an adorned or search field's frame) at that width at the column's start, never wider than the column, so a short value does not stretch across a form; the label and messages keep the column. Left out, nothing changes. It needs one native text control or select child (a `TypeError` otherwise); an unknown width throws a `RangeError`. New classes `sw-field-sized` and `sw-field-width-*`; no new tokens or dependencies. Request: `docs/requests/teisoro-field-width.md`.
