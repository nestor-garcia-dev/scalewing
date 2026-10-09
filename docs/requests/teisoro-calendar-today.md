Scalewing request from Teisoro.

Status: in review on `feat/react-calendar-today` (2026-10-08).
Renderer: react
Missing surface: `today` prop on `DateField` and `CalendarButton` (a `YYYY-MM-DD` date, default the device's local date).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the calendar's today is private to the dialog (`useCalendarPopup` reads `todayDateOnly()`, the device clock). A consumer cannot move the `aria-current="date"` ring, the empty field's starting day, or what **Today** picks.
Existing surface this might already be: `DateField`/`CalendarButton` `max` (it disables later days but still rings the device's day).
Workaround I almost used: faking the device clock, or hiding **Today** and the ring with CSS, which Teisoro may not write.
Teisoro use: every calendar whose `max` is the store's business day: the closeout day's jump-to-date, the reports' and vault history's `DayNavigator`, and the vault's `MovementsCard`.
Proposed API: `today?: string` on `DateField` and `CalendarButton`, validated like `min` and `max`.

## Why

Teisoro's store keeps New York time. The app reads "today" and each calendar's `max` from the store's day, never the device's. The calendar still rings the device's day: a phone in UTC at 10 PM in New York rings tomorrow as today, and that day is disabled because `max` is the store's day. **Today** is then disabled too, on the day the store is still working.

## Behavior and failure boundary

- `today` moves the today ring, the day an empty `DateField` opens on, **Today**, and the year list's span around today.
- Left out, it is the device's local date, so no consumer's calendar changes unless it opts in.
- It may lie outside `min`/`max`; **Today** is then disabled, as for the device's day.
- An empty or malformed `today` throws a `RangeError` ("today must be a valid YYYY-MM-DD date"), as `min` and `max` do.

Rejected alternatives:

- A `timeZone` prop that computes today inside Scalewing. The consumer already knows its business day (it computes `max` from it), and a zone alone would still read the device clock, which a page also injects for tests.
- A `now` instant. It needs the zone too; a date-only `today` matches the value format and is clock-free.

Scalewing owns the prop, the tests, the gallery and the changeset. Teisoro owns passing its store day.

Evidence: `date-field.test.tsx` ("marks, opens on, and picks a given today instead of the device's") and `calendar-button.test.tsx` ("marks and picks a given today instead of the device's"), plus the rejection cases; `apps/gallery/e2e/date-field.spec.ts` and `calendar-button.spec.ts` drive the reef station demos (Honolulu time) at 08:00 UTC on Sep 30 on desktop-en (New York), mobile-es (Madrid) and forced-colors (Los Angeles): Sep 29 is ringed and picked, Sep 30 is disabled and not ringed.
