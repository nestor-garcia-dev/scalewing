Scalewing request from Teisoro.

Status: merged in #65 (2026-09-28) and released in `@scalewing/react` 1.10.0; pending consumer verification in Teisoro (F-007-S03 task 1290).
Renderer: react
Missing surface: `CalendarButton`, an icon-only button that opens DateField's calendar dialog for a date the page already shows.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Button` can show a calendar glyph but has no calendar to open. The only Scalewing calendar lives inside `DateField`, which is a text entry with its own label, so using it for a day heading shows the date twice. Teisoro may not draw its own calendar (`teisoro-date-field.md`, 2026-09-27 ruling).
Existing surface this might already be: `DateField` (its calendar button), `Button`.
Workaround I almost used: a `DateField` labelled "Go to a day" under the day heading, which is what the closeout day page ships today.
Teisoro use: the closeout day page heading (F-007-S03), where the day is a heading with previous and next day arrows, and later any page that steps through days.

## Why

Teisoro's closeout day page shows the day as a heading with previous and next arrows. To jump to another day there is also a separate `DateField` ("Go to a day") under it. A UX review found three problems:

- the date is shown twice, in the heading and in the field;
- the picker is not on the date it changes;
- it adds a row on a 390 px phone, where the long Spanish date already wraps.

The owner first asked for the conventional pattern `‹ [📅 mar, 22 sept 2026 ▾] ›`, where the date itself is a button. On 2026-09-28 the owner changed the design: the date stays a heading and a calendar icon button sits next to it, `‹  martes, 22 de septiembre de 2026 [📅]  ›`. The app keeps its own arrows.

## Proposed API

```ts
type CalendarButtonLabels = Pick<
  DateFieldLabels,
  'previousMonth' | 'nextMonth' | 'month' | 'year' | 'today'
> & { nameSeparator: string }; // default ", "

type CalendarButtonProps = {
  label: string; // what pressing it does: "Choose closeout day"
  value: string; // YYYY-MM-DD, never empty
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string; // the <button>'s id; a ref also reaches the <button>
  locale?: string; // BCP 47; nearest lang attribute, then en-US
  weekStartsOn?: 0 | 1; // default 0
  labels?: Partial<CalendarButtonLabels>;
  size?: 'xs' | 'sm' | 'md'; // Button sizes, default md
  variant?: ButtonVariant; // Button variants, default ghost
};
```

Behavior:

- A native `<button type="button">` drawn by `Button`, showing only the calendar glyph. Square at every size; on a coarse pointer at least the md control height (44 px) at every size.
- Accessible name: `label`, `labels.nameSeparator`, then the value spoken in full in `locale` ("Choose closeout day, Tuesday, September 22, 2026"; "Elegir día de cierre, martes, 22 de septiembre de 2026"). `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` while open, like DateField's calendar button. The separator defaults to `", "`; `Intl.ListFormat` has no neutral join (a Spanish unit list adds "y", Chinese adds nothing), so a product whose language pauses differently passes its own, such as `"、"` in Japanese.
- Enter, Space, or a press opens DateField's calendar dialog (the same internal `CalendarDialog`, month grid, header, keys, and positioning), anchored to the button, named by `label`, on `value`. As on DateField, a `value` outside `min`/`max` is kept, not refused; the calendar then opens on the nearest allowed day with `value` shown selected and disabled. A button has no invalid state (`aria-invalid` is not supported on the button role), so the page that shows the date flags it if it must. Picking a day or **Today** calls `onChange(date)` when it changed, closes, and returns focus to the button. Escape closes without a change and returns focus. A press outside closes without a change and leaves focus where the press put it, as DateField does. There is no **Clear**: the value is never empty.
- Validation reuses DateField's guards and messages: an empty or malformed `value`, `min`, or `max`, `min` after `max`, a bad `locale`, a `weekStartsOn` other than 0 or 1, or an empty label word throw a `RangeError`. Two errors are new: an empty `label` throws `label must be non-empty text`, since it is the button's only name, and an empty `labels.nameSeparator` throws `labels.nameSeparator must be non-empty text`.
- DateField and CalendarButton share one internal hook, `useCalendarPopup`, for the open state, closing when disabled, focus return, and reporting a changed date.
- Styling reuses `Button`'s generated classes plus one generated `sw-calendar-button` class (square, no inline padding, coarse-pointer target). The calendar keeps `sw-date-field-calendar`, which is already the `popup` layer of `src/css/stacking.ts` and a lifted-surface popup; no new z-index. In forced colors the browser paints Button's transparent hairline in a system colour, so the icon-only button keeps visible bounds.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns the heading, its previous and next day buttons, the localized `label` and `labels`, and which days are allowed.

## Name

`CalendarButton` names what it is and what it opens, next to `DateField` whose calendar it reuses, and reads as a sibling of `Button`. `DateButton`, the first working name, suggested a button that shows a date, which it no longer does after the owner's 2026-09-28 change. `DatePickerButton` and `CalendarTrigger` were longer or named an implementation detail.

## Rejected alternatives

- Make the date text itself the button (`‹ [📅 mar, 22 sept 2026 ▾] ›`, the first brief, with long and compact formats per breakpoint). It removes the heading's semantics, since the day would be a button's name instead of a heading, and the owner preferred the icon.
- A `DateField` variant prop. It would turn a text-entry component into a different interaction (no entry, no field label, no empty value) behind one prop, and every DateField prop would need a rule for which variant it applies to.
- Exporting `CalendarDialog` raw. It needs anchoring, a trigger for outside presses, focus return, and label wiring (`aria-controls`, `aria-expanded`, a labelled dialog) that every consumer would redo, and it would freeze an internal API.
- Consumers styling a `Button` and managing a popover themselves. That is a product-drawn calendar or a copy of Scalewing internals, which the 2026-09-27 ruling and hard rule 18 exclude.

## Evidence

- Unit tests: `packages/react/src/calendar-button.test.tsx` (names in en-US, es-US and from `lang`; opening with a press, Enter, and Space; arrows then Enter choosing a day with focus returned; Space and a press on a day; Today; Escape, a press outside, and a second press closing without a change; `min`/`max` disabling days; disabled and becoming disabled while open; every invalid prop; Button size and variant classes; the forwarded ref and id; a value outside the bounds; a Japanese separator; unique ids and resolvable references), plus `calendarTriggerName` in `calendar-labels.test.ts` (en-US, es-US, ja), `resolveCalendarButtonLabels` in `calendar-button-labels.test.ts`, `assertWeekStart` in `calendar-month.test.ts`, and the generated square and coarse-pointer rules in `css/stylesheet.test.ts`.
- Gallery: the `CalendarButton` section (`apps/gallery/src/sections/calendar-button.tsx`) shows an English survey-day heading bounded to September 2026 and a Spanish census-day heading with Monday weeks, each with ghost previous and next buttons, plus small, extra-small, and disabled buttons. `apps/gallery/e2e/calendar-button.spec.ts` runs on desktop-en, mobile-es (390 px, touch, coarse pointer), and forced-colors.

## Follow-up request (2026-10-08, Teisoro F-006-S11 task 1875): the period a page shows

Status: merged in #101 (2026-10-09) and released in `@scalewing/react` 1.22.0 for Teisoro F-006-S11 task 1875; Teisoro pins and adopts it in task 1880.
Source: Teisoro UX review `admin-reports.md`, finding RPT-17 (polish; left to Scalewing entirely). The closeout and Services reports, and the vault history, pick a day, a week, a month or a year with the shared `PeriodToolbar`, whose `CalendarButton` takes the period's first day as `value`. Open on the week Sep 27 – Oct 3, 2026, the calendar fills only "27"; a month reads as its first day. Picking any day works, but the calendar does not show which days the report covers.

Teisoro need: the open calendar shows the report's whole period, and picking a day still moves the report to that day's period.

Proposed API: `range?: { start: string; end: string }` on `CalendarButton`; `value` keeps its meaning.

Behavior and failure boundary: presentation only. Each day from `start` to `end` gets `sw-date-field-day-in-range` (the accent mixed at 16 % over the calendar's glass, 24 % under the pointer, square corners), the first `sw-date-field-day-range-start` (rounded at its inline start) and the last `sw-date-field-day-range-end` (rounded at its inline end; a one-day range takes both), so a week row reads as one band; days of a neighboring month shown in the grid are tinted when they are in the span. Contrast on the band: every number on it is in the text color, which keeps 4.5:1 there in every palette and scheme (the muted color of a neighboring month's day, and today's accent, fell below AA on the 16 % band, the first review's finding); today keeps its accent ring, 3:1 or more against the band, and the band stands apart from the glass behind it (1.2:1 or more). `accentSubtle` was tried and rejected: it is mixed against the surface rather than the glass, and fades to the bare surface where the accent is near AA, so the band vanished in most dark palettes (the second review's finding). The selected day keeps its accent fill and is always a pill on top of the band (`border-radius` on the selected rule), and today's ring is unchanged. In forced colors the band is `Mark` / `MarkText` (forced-color-adjust none), today and a neighboring month's day included, under the selection's `Highlight`. The range is not announced: `aria-selected` stays the value alone, as the date picker pattern has one selection, and the consumer's heading or the button's label names the period. A malformed `start` or `end`, or a `start` after the `end`, throws a `RangeError`. The range need not contain `value` and need not sit inside `min`/`max`.

Rejected alternatives:

- `aria-selected` on every day of the range. The grid would announce a multi-selection that a press cannot make.
- A range picker (choose a start and an end). The reports choose a period by its kind and any one day in it; the span is derived, not picked.
- `range` on `DateField` too. No consumer needs it there yet; `CalendarDialog` takes it, so it can follow.

Evidence: `calendar-button-range.test.tsx` (`dayInRange` start, inside, end, out, a one-day range as both ends; the refusals; a one-day range rounded at both ends; in every palette and scheme, the text at 4.5:1 or more on the band, today's ring at 3:1 or more, the band at 1.2:1 or more against the glass; the rule order that keeps today's number in the text color and the selected day on top; a week tinted with its ends rounded and the value still the one selected day, seven tinted days including October's; the generated rules); `apps/gallery/e2e/calendar-button.spec.ts` "CalendarButton tints the week it shows and keeps the value selected" on desktop-en, mobile-es and forced-colors: the gallery's watch week tints seven days, Sunday the 27th stays selected, a middle day is tinted and square, the end is rounded only at its end, and picking the 15th moves the heading to the week of the 13th.
