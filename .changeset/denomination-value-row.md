---
'@scalewing/react': minor
---

`DenominationGrid` row `valueRow` (opt-in, strip layout): a line right under a row that gives each column's value, such as the money its count adds up to. It is its own table row on the subtle fill, named in the label column (`label`), each consumer-formatted value centred under its count in tabular figures (`null` or `''` blank), with the row's `total` moved onto it; each typed count is described by the value under it, which is no tab stop. `Stepper` gains `aria-describedby` (ids read before its error). The grid still does no arithmetic or currency formatting. New classes `sw-denomination-value-row` and `sw-denomination-value`; no new tokens, no new dependency. Request: `docs/requests/teisoro-denomination-value-row.md`.
