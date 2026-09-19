Scalewing request from Teisoro.

Status: planned under Teisoro F-002-S05 task 590.
Renderer: react
Missing surface: `FilterChips`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: SegmentedControl is compact and currently non-wrapping; Select hides the full filter set. Recreating chips in Teisoro would duplicate selection and visual logic.
Existing surface this might already be: SegmentedControl.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Single-choice Services, NSF, and vault dashboard filters with counts.
Proposed API: label, value, onChange, options (value, label, disabled).
Behavior and failure boundary: Wrap responsively, expose one selected choice through radiogroup semantics, and support keyboard, focus, disabled options, and long localized labels. Counts are part of consumer labels.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
