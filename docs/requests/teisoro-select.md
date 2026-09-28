Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); not started.
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

Status: implemented on `claude/services-ux-fixes` for Teisoro F-007-S05 task 1335; pull request pending review. The placeholder, `required` and `error` from the same finding are the next follow-up.
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
