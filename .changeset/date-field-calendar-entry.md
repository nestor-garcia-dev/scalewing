---
'@scalewing/react': minor
---

`DateField` `entry="calendar"` (`DateFieldEntry`, `dateFieldEntries`; default `typed`, unchanged): a day-picker field, one neutral field-shaped `Button` showing the calendar glyph and the chosen day in the locale's medium style, or `labels.chooseDate` while empty, that opens the same calendar. It is named by the label and its words and described by `description` and `error`; a required one is described by the new `labels.required` ("Required"). The consumer's `error` reports a missing day. An unknown entry throws a `RangeError`. New classes `sw-date-field-calendar-entry`, `sw-date-field-calendar-entry-text` and `sw-date-field-calendar-entry-invalid`; no new tokens or dependencies. Request: `docs/requests/teisoro-date-field-calendar-entry.md`.
