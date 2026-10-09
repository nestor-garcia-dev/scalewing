---
'@scalewing/react': minor
---

`CalendarButton` `range` (`docs/requests/teisoro-calendar-button.md`, 2026-10-08 follow-up, Teisoro F-006-S11, RPT-17). `range?: { start: string; end: string }` (`YYYY-MM-DD`, both ends included) is the span a page shows around `value`, such as a week or a month: the open calendar tints its days as one band per week row (the accent at low strength, square inside, rounded at the start and the end; `Mark` in forced colors), so a picker for a period shows the whole period. `value` stays the selected day, now always a pill, and today's ring is unchanged. The tint is not announced; the page's own heading names the period. A malformed end or a start after the end throws a `RangeError`. New exported type `CalendarButtonRange`; new generated classes `sw-date-field-day-in-range`, `sw-date-field-day-range-start`, `sw-date-field-day-range-end`. No new tokens and no new dependencies.
