---
'@scalewing/react-native': minor
---

Pickers close the way people expect (see `docs/requests/futmas-wheel-close.md`).
A tapped row closes `WheelField`; `TimeField` stays open on a tapped hour and
closes on a tapped minute or AM/PM row; a scroll that settles on a row selects
and keeps the picker open. Opening a `DateField`, `TimeField`, or `WheelField`
closes any other one open under the same `ThemeProvider`. No prop changes.
