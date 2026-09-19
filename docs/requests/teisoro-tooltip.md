Scalewing request from Teisoro.

Status: planned under Teisoro F-002-S05 task 570.
Renderer: react
Missing surface: `Tooltip`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Native title is unreliable for keyboard and touch; a product popover and CSS would duplicate overlay behavior.
Existing surface this might already be: None.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Icon-only actions and truncated explanatory content in retained operational routes.
Proposed API: content, labelled trigger or anchor.
Behavior and failure boundary: Expose help on focus and hover, support touch access, and dismiss on Escape/blur. Tooltip content supplements an accessible name rather than replacing it. Consumer supplies localized text.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
