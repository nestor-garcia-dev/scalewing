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

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): the required mark

Status: implemented on `claude/services-ux-fixes` for Teisoro F-007-S05 task 1335; pull request pending review.
Source: Teisoro UX review `services-nsf.md`, finding NSF-15 (minor, the Scalewing part; Teisoro owns the block reason's `required`).

`DateField` took `required` and set the entry's native `required`, but its label never showed the asterisk `Field` shows: on the NSF record form "Date reported" looked optional beside "NSF fee ($) *" until the person was stopped.

Behavior: with `required`, the label ends in the same mark as `Field`'s (`<span aria-hidden="true" class="sw-field-required"> *</span>`, the danger color from the generated `sw-field-required` rule). The entry's accessible name stays the label alone, and the calendar button's description (the label, by `aria-describedby`) leaves the hidden mark out. No API change.

Consumer note: the label's text content now ends in " *" when required, as `Field`'s does; a test that finds the entry with an exact `getByLabelText('<label>')` should use its role and name (`getByRole('textbox', { name })`) or `exact: false`.

Rejected alternative: a separate DateField-only mark class. The mark is one convention across fields, so it reuses `sw-field-required`.

Evidence: `date-field.test.tsx` (the mark, its class and `aria-hidden`, inside the entry's label; the button still described by "Sighting date"); `apps/gallery/e2e/date-field.spec.ts` "a required DateField marks its label as Field does" on desktop-en, mobile-es and forced-colors: the gallery's required "Hatch date" shows a visible `*` in a color apart from the label, the entry's accessible name is "Hatch date", and the optional "Tagging date" has no mark.
