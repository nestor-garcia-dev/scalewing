Scalewing request from Teisoro.

Status: implementation in progress under Teisoro F-002-S05 task 520.
Renderer: react
Missing surface: `DateField`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Field labels a child but does not own a consistently styled date input or date-only contract. A hand-styled native date input in Teisoro would duplicate the control skin.
Existing surface this might already be: Field.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Employee hire and birth dates, NSF record/activity dates, vault bank-debt dates, and period selection.
Proposed API: label, value (YYYY-MM-DD), onChange, min, max, disabled, required, description, error.
Behavior and failure boundary: Use native date-input behavior where supported. Keep serialized values date-only without UTC conversion; surface invalid/min/max states, keyboard entry, focus, and locale-aware display. Do not invent a JavaScript calendar unless native behavior demonstrably fails the acceptance matrix.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

## 2026-09-27 update: a Scalewing-drawn calendar

Status: implemented for the react 1.9.0 release (Teisoro F-007-S03 task 1280; PR #61 reviewed and merged); pending consumer verification in Teisoro (task 1285).

Decision: on 2026-09-27 the Teisoro product owner ruled that the native `<input type="date">` fails the acceptance matrix above. The browser draws its own calendar, so it differs by browser and operating system, cannot follow Scalewing's visual language (quiet, glass-minimal, large radius, hairline borders), and cannot be captured in screenshots for UX review. The "use native date-input behavior" and "do not invent a JavaScript calendar" lines above are kept as history and are superseded by this section.

Renderer: react
Missing surface: `DateField` draws its own calendar (a changed behavior of the existing component, not a new one).
Why the native input cannot do this: the calendar popup and its keyboard model are browser chrome; tokens and generated CSS cannot reach them, and headless screenshots do not show them.
Existing surface this might already be: `DateField` itself. The native `Calendar` in `@scalewing/react-native` shows the same month logic; its pure modules are reimplemented in `@scalewing/react` (no cross-renderer import).
Workaround I almost used: a product-owned date picker in Teisoro, or a third-party picker with its own skin.

Requested behavior:

- Backward-compatible API: `label`, `value` (`YYYY-MM-DD` or `''`), `onChange`, `min`, `max`, `disabled`, `required`, `description`, `error`, with the same date-only guarantees and `RangeError` guards.
- Additive props with generic names: `locale` (BCP 47; month and weekday names and the typed order come from `Intl`), `weekStartsOn` (`0` Sunday or `1` Monday, matching the native renderer's name), and `labels` for the control's own words (English defaults; products are bilingual).
- Fast typing: a text entry in the locale's numeric order with a calendar button beside it, plus month and year selectors in the calendar header, so a birth date decades back never needs hundreds of clicks.
- The calendar opens in a popover anchored to the field, styled only from tokens through generated CSS, showing today, the selected day, and days outside `min`/`max` as disabled, and fitting a 390 px phone without sideways scroll.
- Accessibility per the WAI-ARIA APG date picker dialog: a labelled modal dialog with a grid; arrows by day and week, PageUp/PageDown by month, Shift+PageUp/PageDown by year, Home/End to the week's edges, Enter/Space select and close, Escape closes and returns focus to the button; selected and today are announced; disabled days are `aria-disabled`. Invalid typed text and out-of-range values set `aria-invalid`.

Decided in implementation:

- `locale` defaults to the nearest `lang` attribute when the field mounts, then `en-US`. A malformed explicit tag throws. Products that switch language without remounting pass `locale`.
- `weekStartsOn` defaults to `0` on web so a US English screen reads Sunday first in every browser; `Intl` week data is not used because it differs between browsers.
- Typed text also accepts eight bare digits and ISO `YYYY-MM-DD` in every locale. Text that is not a date keeps the last value, as the native input did, and after the person leaves the field sets `aria-invalid` with `labels.invalidEntry`. The entry blocks form submission as the native input's `badInput`, `rangeUnderflow` and `rangeOverflow` did, through `setCustomValidity` with `labels.invalidEntry` or `labels.outOfRange`.
- The field label names only the text entry. The calendar button is named `labels.chooseDate` and described by the field label, so `getByLabel('<field label>')` stays unique.

Teisoro must adapt: tests that drove `input[type=date]` now use the text entry (`getByLabel('<label>').fill('03/10/2024')` in en-US order, or `fill('2024-03-10')` in ISO) or the calendar (`getByRole('button', { name: 'Choose date' })`, then the `grid` and `gridcell` roles). Assertions on the input value now see the locale's display text, not `YYYY-MM-DD`; assert the serialized value from the product's state instead. Teisoro passes Spanish `labels` and `locale` on its bilingual screens.

## 2026-09-28 follow-up: typed order apart from the names locale

Status: implemented on `claude/date-entry-locale` for the next `@scalewing/react` minor (Teisoro F-007-S03 task 1285); pending review, merge, release and consumer verification.

Renderer: react
Missing surface: an `entryLocale` prop on the existing `DateField` (additive; no new component).
Why the existing API cannot do this: `locale` sets both the month and weekday names and the typed field order, and `Intl` gives day-first `DD/MM/YYYY` for every Spanish locale (`es`, `es-US`, `es-MX`). Teisoro's product owner decided that dates stay in American numeric order (`MM/DD/YYYY`) in both English and Spanish, so Spanish screens cannot get Spanish names with an American typed order.
Existing surface this might already be: `labels` sets only the placeholder letters, not the order; `locale="en-US"` would lose the Spanish names in the calendar.
Workaround I almost used: `locale="en-US"` on Spanish screens with English month and weekday names, or product-side reformatting of the entry text.

Decided in implementation:

- `entryLocale?: string` is a BCP 47 tag validated like `locale`: a malformed tag throws `RangeError('entryLocale must be a BCP 47 language tag')`.
- It sets only the typed entry: its field order, separator, placeholder and display text. It defaults to the resolved `locale` (explicit, then the nearest `lang`, then `en-US`), so existing fields are unchanged.
- Month and weekday names, spoken day labels and everything in the calendar dialog keep `locale`. ISO `YYYY-MM-DD` and eight bare digits are still accepted, the digits split in the entry order.
- The name is generic: any product can pair one language's names with another locale's numeric order.

Teisoro use: `locale="es-US" entryLocale="en-US"` (or `entryLocale="en-US"` on every bilingual `DateField`) with its Spanish `labels`, so a Spanish screen shows `MM/DD/AAAA` and `marzo` together.
