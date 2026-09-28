---
'@scalewing/react': minor
---

New `CalendarButton`: an icon-only `Button` that opens the `DateField` calendar dialog for a date the page already shows, such as a day heading with its own previous and next buttons (`docs/requests/teisoro-calendar-button.md`).

- Props: `label`, `value` (`YYYY-MM-DD`, never empty), `onChange`, and optional `min`, `max`, `disabled`, `locale`, `weekStartsOn`, `labels` (the calendar's words: `previousMonth`, `nextMonth`, `month`, `year`, `today`), `size` (`xs`, `sm`, `md`; default `md`), and `variant` (a Button variant; default `ghost`). New types `CalendarButtonProps` and `CalendarButtonLabels`.
- The accessible name is `label` then the spoken date ("Choose survey day, Tuesday, September 22, 2026"), with `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` while open. Enter, Space, or a press opens the calendar on `value`; choosing a day calls `onChange`, closes, and returns focus to the button; Escape and a press outside close without a change.
- Invalid values, bounds, locale, week start, label words, or an empty `label` throw a `RangeError`, with `DateField`'s messages.
- New generated class `sw-calendar-button`: square at every Button size, and at least the 44 px md control height on a coarse pointer. The calendar reuses `sw-date-field-calendar` and its existing stacking layer.

No new dependencies.
