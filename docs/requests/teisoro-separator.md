Scalewing request from Teisoro.

Status: planned under Teisoro F-002-S05 task 580.
Renderer: react
Missing surface: `Separator`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: A hand-styled hr or border in each product would duplicate a reusable token-based visual rule.
Existing surface this might already be: None.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Menu groups and operational form/detail sections.
Proposed API: orientation, decorative.
Behavior and failure boundary: Render a semantic separator when meaningful and a hidden decorative divider otherwise. Generate its color and thickness from tokens.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
