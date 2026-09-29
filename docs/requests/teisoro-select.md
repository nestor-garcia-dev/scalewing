Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25). `error` is released in `@scalewing/react` 1.12.0 (the 2026-09-28 placeholder follow-up below); `disabled` is not started.
Renderer: react
Missing surface: `Select` `disabled` and `error` props.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Select` takes `label`, `options`, `value`, `onChange`, `size` and an optional `action`, but no way to show the choice as fixed or as invalid. `Field` has both (its validation props came from teisoro-field-validation.md), so a form that mixes text fields and selects reports errors two ways. Teisoro's vault Remove Cash dialog opens locked to one type for the monthly commission, and its Add Cash, Remove Cash, Edit movement and Resolve variance dialogs must say "Choose a source or reason." or "Choose a category." under the select after a first submit.
Existing surface this might already be: `Field` `error` and `disabled` (text inputs only); `DetailRow`-style `Text` pairs for a fixed value.
Workaround I almost used: none in Scalewing. Teisoro renders the locked type as a label/value detail row with a lock notice instead of a select, and the error as an alert `Text` under the select, with no `aria-invalid` or `aria-describedby` on the combobox.
Teisoro use: `apps/teisoro-web/src/app/vault-page/MovementDialog.tsx` (source or reason, the commission lock), `RecategorizeDialog.tsx` (category), `ResolveDialog.tsx` (resolution category), and the Period select on the vault page. Design: Teisoro `docs/design/vault/README.md`, Scalewing gap 1.
Proposed API: `disabled?: boolean` (the trigger is `aria-disabled`, stays focusable so the value is read, and does not open; the value keeps full contrast) and `error?: string` (rendered and wired as `Field` does: `aria-invalid`, the message linked by `aria-describedby`, the danger tone on the border and message).
Behavior and failure boundary: presentation and accessibility only; the consumer decides when a value is invalid and supplies the localized message. An empty `error` string is treated as no error.

Scalewing owns the props, tests and gallery evidence. Teisoro owns the copy and when it shows.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): the closed trigger

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-drawer-cash-and-audits.md`, finding DRW-12 (polish, the Scalewing trigger part).

In the drawer adjustment dialog's reason `Select`, the closed trigger's text sat near the top of its 44 px box (`.sw-select-trigger` was `inline-flex` with no `align-items`), its caret was two gradient triangles unlike the `Accordion` chevron, and the box grew from about 183 px to 343 px once a reason was chosen (`width: max-content` sized it to the current label).

Behavior:

- The trigger centres its text (`align-items: center`) and ends in the `Accordion` chevron, pointing down: a `::after` drawn from `chevronStroke`, which `css/chevron.ts` now shares between the two (`Accordion`'s marker output is unchanged apart from declaration order). Forced colors draw it in `CanvasText`.
- The trigger is as wide as its longest option, as a native select is: its text sits in `.sw-select-value`, a one-cell grid holding the current label (`.sw-select-value-text`) over one hidden `.sw-select-value-sizer` per option, whose label is drawn from `data-label` by `::before`. The copies are `aria-hidden`, invisible and not text content, so the trigger's text and accessible value are only the current label. Past the available width (`max-width: 100%`) the label ellipsizes.
- `Select.tsx` split its listbox (`components/select/SelectListbox.tsx`) and trigger text (`SelectValue.tsx`) out before growing.

No API change.

Rejected alternatives:

- A `width="full"` prop (the review's other option). Sizing to the longest option removes the jump without making each consumer choose; a full-width select in a form can be added later if a consumer needs it.
- Rendering the hidden labels as real text. The trigger's text content would then include every option, which changes what tests and assistive technology read.

Evidence: `select.test.tsx` ("sizes the closed trigger to its longest option without adding text"); `css/stylesheet.test.ts` (centred trigger, the stroked chevron, no gradient, the `data-label` sizer, new classes); `apps/gallery/e2e/select.spec.ts` "Select keeps its width when the value changes and centres its text" on desktop-en, mobile-es and forced-colors with the gallery's new "Survey reason" select: the text's middle is within 1 px of the trigger's, the caret is a 2 px stroked `::after` with no background image, the width is unchanged after choosing the longest reason, and the trigger stays inside the section on a phone (ellipsized).

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): `placeholder`, `required` and `error`

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-drawer-cash-and-audits.md`, finding DRW-12 (polish): "Add a `placeholder` prop, so 'Choose a reason' shows in the closed trigger but is not an option. Add `required` and `error`, as `Field` has, so the reason error sits on the control." Teisoro's `AdjustmentDialog.tsx` passes `{ value: '', label: text.choose }` as the first option today.

Proposed and implemented API (all optional, no default change):

- `placeholder?: string`: shown in the closed trigger, muted (`.sw-select-placeholder`), while `value` matches no option. It is not in the listbox, no option is `aria-selected` while it shows, it never reaches `onChange`, and it is one of the trigger's sizers, so choosing a value does not resize the trigger. A blank placeholder throws a `RangeError`. Without it, a `value` that matches no option still shows the first option's label, as before.
- `required?: boolean`: the label ends in `Field`'s `aria-hidden` mark (`sw-field-required`), and the trigger gets `aria-required="true"`.
- `error?: string`: a `sw-field-error` message under the control, linked by the trigger's `aria-describedby`, with `aria-invalid="true"` and a danger border (`.sw-select-invalid`, `Mark` in forced colors). Like every field error it lives in a polite live region that is always rendered, empty without an error, so a new error is announced once, politely, and never as an alert (see `teisoro-field-validation.md`, 2026-09-28). An empty string is no error.

The Select's open state and keyboard model moved into `components/select/use-select-list.ts` so `Select.tsx` stays one rendering responsibility (162 lines).

Rejected alternatives:

- A `description` prop in the same change. No consumer asked for it on `Select` yet; it can reuse the same message slot when one does.
- Keeping the placeholder as a disabled first option. It would still be in the list, where the review found it confusing, and a listbox option that cannot be chosen adds a stop for keyboard users.

Evidence: `select.test.tsx` ("shows a placeholder that is not an option until a value is chosen", "marks a required select and wires its error as Field does", "rejects a blank placeholder"); `css/stylesheet.test.ts` (placeholder and invalid rules, classes); `apps/gallery/e2e/select.spec.ts` "Select shows a placeholder, a required mark, and an error described on its trigger" on desktop-en, mobile-es and forced-colors, with the gallery's "Visit reason": the trigger reads "Choose a reason", has `aria-required` and the `*`, the polite error region exists empty before "Log visit" and holds the error after it, which sets `aria-invalid` and the accessible description with no `alert` and a danger border, the list has only the three reasons, and choosing one clears the error without changing the trigger's width.

## Follow-up (2026-09-28, Teisoro F-007-S05 task 1350): the label row matches Field's

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
Source: found while fixing Teisoro's NSF-35 for `DateField` (`teisoro-date-field.md`, 2026-09-28 label row follow-up). The same measurement in the gallery showed `Select`'s label row at 20 px, where `Field`'s is 25 px, so a `Select` beside a `Field` sat 5 px higher. The cause is the same: `Select` rendered its label as `<Text as="label" variant="label">`, with the label type on the `<label>` itself, while `Field`'s `<label>` keeps the canvas's body type around a label-size span.

Behavior (no API change): `Select` draws its label with `FieldLabelText`, the internal component that `Field` and `DateField` use (the label words as a `Text` label span, or a caption span at `size="xs"`, then the `aria-hidden` required mark), inside a plain `<label htmlFor id>`. The label rows are the same height, so a `Select` beside a `Field` lines up at the label and the control. `labelVisuallyHidden` now hides the span inside the label, as `Field` does; the label still takes no row. The trigger's `aria-labelledby`, its accessible name and the label's `htmlFor` are unchanged.

Consumer note (also in the changeset, per AGENTS rule 12): the `<label>` no longer carries `sw-text-label` or `sw-sr-only`; the span inside it does, so selectors on `label.sw-text-label` move to the label element or the span. A visible `size="xs"` label row goes from 18 px to 25 px, as tall as a visible `xs` `Field` label row. A visible `md` row goes from 20 to 25 px. A hidden label still takes no row.

Rejected alternative: setting the Select label's `line-height` to the body's. It matches only while the two fonts keep their sizes; sharing the markup keeps them equal by construction, as for `DateField`.

Evidence: `select.test.tsx` ("Select label row": the Select label's markup equals a required `Field`'s with its own words, the label has no class of its own, and the trigger is still labelled by it); the existing Select tests unchanged, including the visually hidden `xs` label; `apps/gallery/e2e/select.spec.ts` "a Select beside a Field lines up its label and control" on desktop-en, mobile-es and forced-colors, with the gallery's new required "Survey plot" beside a required "Plot size" field: the trigger's and the field frame's tops, and the label text tops, are within 0.5 px, the label rows are the same height, and the hidden "Compact range" label is at most 1 px tall.
