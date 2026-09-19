Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S05 task 530; pending review and packed-consumer verification.
Renderer: react
Missing surface: `Checkbox`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Field plus raw input leaves reusable checkmark, focus, disabled, and invalid appearance in product CSS. Switch represents a persistent setting, not a discrete form choice.
Existing surface this might already be: None.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Service/check-cashing forms and drawer/vault audit or change-order confirmations.
Proposed API: label, checked, onCheckedChange, disabled, required, description, error.
Behavior and failure boundary: Use a native checkbox for keyboard and form semantics; generated token styles own the visual state. Space toggles once; disabled cannot invoke the callback.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
