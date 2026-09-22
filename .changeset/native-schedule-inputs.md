---
'@scalewing/react-native': minor
---

Add `DateField`, `TimeField`, and `MultiSelect` for React Native (see
`docs/requests/futmas-date-field.md`, `futmas-time-field.md`, and
`futmas-multi-select.md`). `DateField` discloses a localized month grid with
`min`/`max` bounds; `TimeField` discloses hour and minute chips on a
`minuteStep`; `MultiSelect` is a labeled group of checkbox chips. Fix `Field`
text clipping on iOS by dropping the fixed `lineHeight` from the native input
and centering vertically on Android. No dependencies were added.
