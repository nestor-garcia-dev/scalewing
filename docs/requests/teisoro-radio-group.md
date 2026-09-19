Scalewing request from Teisoro.

Status: planned under Teisoro F-002-S05 task 540.
Renderer: react
Missing surface: `RadioGroup`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: SegmentedControl works for short button toggles but its compact horizontal presentation does not fit longer vertical form options. A raw radio group would require product control styling.
Existing surface this might already be: SegmentedControl.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: NSF payment and record forms plus vault audit resolution.
Proposed API: legend, value, onChange, options (value, label, disabled), description, error.
Behavior and failure boundary: Use native grouped radio inputs with a shared name, one selected value, and correct keyboard behavior. Keep business option values and localized labels in Teisoro.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
