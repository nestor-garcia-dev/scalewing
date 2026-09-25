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
