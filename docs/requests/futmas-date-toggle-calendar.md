Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.55.0 (accepted 2026-10-25; FutMas F-010-S15 "Build, review and publish the schedule" gap 3: the build sheet's match days, play dates toggled off as days off; standing owner approval).
Renderer: react
Missing surface: a multi-month calendar whose days toggle on and off. A new component, `DateToggleCalendar`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `DateField`, `CalendarButton` and `DateRangeButton` pick one date or a range; `FilterChips` toggles a list, not a month grid, and has no per-day spoken state.
Existing surface this might already be: none.
Workaround I almost used: `schedule/MatchDayChips.tsx`, one `FilterChips` (`multiple`) per month, each chip a play date.

## Accepted API (2026-10-25)

`DateToggleCalendar { label; min; max; value: readonly string[]; onChange(value: string[]); isDateDisabled?(date) => boolean; toggledLabel?; locale?; weekStartsOn?: 0 | 1; disabled? }`.

- Months from `min`'s to `max`'s (at most 24), each a `grid` named by its title; a day that can be toggled is an `aria-pressed` button named by its full date plus `toggledLabel` while on; other days are muted, `aria-disabled` and not controls.
- One Tab stop; arrows move between days that can be toggled (skipping the rest), up and down by weeks, Home/End to the month's ends, PageUp/PageDown to the first day of the nearest earlier or later month that has one; Space and Enter toggle.
- `onChange` gets the sorted days without repeats. Invalid props throw a `RangeError`. Below about 340 px of width the days shrink with the grid rather than widen the page.
- Days are DateField's 44 px square (each a seventh of the column where that is narrower, about 41 px at 320 px); on is the accent fill (Highlight in forced colors).

Evidence: `date-toggle-calendar.test.tsx`, `date-toggle-dates.test.ts`, `schedule-grid-css.test.ts` (its CSS block); `apps/gallery/e2e/date-toggle-calendar.spec.ts` (press, keys, phone stacking, forced colors, axe); gallery section "DateToggleCalendar".
