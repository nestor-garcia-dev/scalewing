Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #188; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 3; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: a day-picker field: a labelled "Choose a day" button that opens the calendar, with Field's label, description, required mark and error. Accepted as `DateField` `entry="calendar"`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the employee board's hire date is a grey button with a calendar glyph and "Choose a day" under its label, showing the day once picked. `DateField` always has a typed entry; `CalendarButton` is icon-only, never empty and has no label, description or error; a `Field` around a `CalendarButton` cannot wire the description or error to a non-native control and still shows no text. Teisoro F-012-S20 lists the typed hire date as a remaining difference.
Existing surface this might already be: `CalendarButton` (icon-only, a date the page already shows, never empty); `DateField` (typed entry plus calendar). The calendar, its words, bounds, today and clear are DateField's, so the picker is a DateField entry, not a second component or a CalendarButton mode.
Workaround I almost used: a Teisoro composite of `Button`, `CalendarButton` and `Text` with its own description wiring.
Teisoro use: the employee form's hire date, and any form day that is picked, not typed.
Proposed API: `DateField entry="calendar"`.

## Accepted API (2026-10-14)

- `DateField` gains `entry?: 'typed' | 'calendar'` (`DateFieldEntry`, `dateFieldEntries`), default `typed` (unchanged). An unknown value throws a `RangeError`.
- `calendar` replaces the text entry and its calendar button with one neutral `Button` (`sw-date-field-calendar-entry`): the field control's small radius, sized to its words on one line at the column's start, holding the calendar glyph (spacing step 4) and the value in the locale's medium date style, or `labels.chooseDate` while empty. It opens the same calendar on the popover layer (pick, month and year steps, Today, Clear on an optional field; focus returns to it on close).
- Its name is the field's label then its words (`aria-labelledby`), so a label press also opens it; it is described by `description` and `error` as the typed entry is. A button has no required state, so a required one is described by `labels.required` first (a new `DateFieldLabels` key, default "Required"). There is no text to check: the consumer's `error` reports a missing or wrong day; the danger edge (`sw-date-field-calendar-entry-invalid`) shows while `error` is set or the value is outside `min`/`max`.
- `labels.required` is the only new word; `chooseDate` is reused as the empty text ("Choose a day").
- New classes `sw-date-field-calendar-entry`, `-text` and `-invalid`; rules in `css/css-date-field-calendar-entry.ts`, the button in `components/date-field/CalendarEntryButton.tsx`, and the typed entry moves to `components/date-field/TypedEntry.tsx` so DateField only lays the field out. A long day or word ends in an ellipsis (`sw-date-field-calendar-entry-text`); the name keeps it whole. A value outside `min`/`max` should come with an `error`, as a button cannot be `aria-invalid`. No new tokens or dependencies.

### Differences from the boards (Teisoro D-2)

- The day shows in the locale's medium style; the board shows only the empty "Choose a day".
- The glyph is DateField's calendar stroke, not the board's.
- The day is set in the Button's label type (weight 600), as the board's empty words are, not the typed entry's body weight.

No board figures are quoted here.

Evidence: `date-field-calendar-entry.test.tsx` (no text entry, the name from the label and its words, the popup ARIA and tab stop, the description, a pick shown and focus returned, a label press and Clear, required said and the error edge, disabled, the refusal, the generated rules); the existing DateField tests unchanged; gallery "DateField" (an empty required calendar entry with Check that shows its error, and a filled one, beside a sized Field); `apps/gallery/e2e/date-field-calendar-entry.spec.ts` on desktop-en, mobile-es and forced-colors (a field-shaped button, its error and danger edge in light, dark and forced colours, picked with the keyboard, focus back, the day shown, no sideways scroll at 390 px, light and dark).
