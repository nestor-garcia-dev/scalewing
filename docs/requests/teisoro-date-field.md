Scalewing request from Teisoro.

Status: planned under Teisoro F-002-S05 task 520.
Renderer: react
Missing surface: `DateField`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Field labels a child but does not own a consistently styled date input or date-only contract. A hand-styled native date input in Teisoro would duplicate the control skin.
Existing surface this might already be: Field.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Employee hire and birth dates, NSF record/activity dates, vault bank-debt dates, and period selection.
Proposed API: label, value (YYYY-MM-DD), onChange, min, max, disabled, required, description, error.
Behavior and failure boundary: Use native date-input behavior where supported. Keep serialized values date-only without UTC conversion; surface invalid/min/max states, keyboard entry, focus, and locale-aware display. Do not invent a JavaScript calendar unless native behavior demonstrably fails the acceptance matrix.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
