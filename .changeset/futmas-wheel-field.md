---
'@scalewing/react-native': minor
---

Add `WheelField`, a labeled field-shaped disclosure that opens one snapping
wheel over an ordered list of `{ id, label }` items for choices that chips
cannot hold, such as a year (see `docs/requests/futmas-wheel-field.md`). It
reuses the wheel behind `TimeField` with no native module or new dependency:
rows are radio targets, a settled scroll or a tap selects, an empty value
rests on the first item and reports nothing until a tap or a scroll. Props:
`items`, `value`, `onChange`, `label`, `placeholder`, `disabled`, `hint`,
`error`, `wheelLabel`, and `testID` (the column is `<testID>-wheel`).
