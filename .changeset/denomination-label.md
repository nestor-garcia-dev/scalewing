---
'@scalewing/react': minor
---

`DenominationGrid` `labelAppearance` (with `DenominationLabelAppearance` and `denominationLabelAppearances`): `'tone'` (default, unchanged) or `'plain'`, row labels in the text color at label weight with no tone stripe, in both layouts; a row's tone still colors its total (`docs/requests/teisoro-denomination-grid-label.md`, Teisoro F-011 release R2). An unknown value throws a `RangeError`. New generated class `sw-denomination-labels-plain`. No new tokens or dependencies.
