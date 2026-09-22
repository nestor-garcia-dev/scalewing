---
'@scalewing/react-native': minor
---

`TimeField` discloses scrolling wheels instead of hour and minute chips: an
hour column on the locale's hour cycle, a minute column on `minuteStep`, and
an AM/PM column on 12-hour locales, all snapping `ScrollView`s built from
tokens with no native module or new dependency (see
`docs/requests/futmas-time-field.md`, revision 2026-09-22). Rows are radio
targets; a settled scroll or a tap selects. New optional props `periodLabel`
and `testID` (columns are named `<testID>-hours`, `-minutes`, `-period`).
