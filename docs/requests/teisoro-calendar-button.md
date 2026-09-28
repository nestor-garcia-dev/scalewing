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
