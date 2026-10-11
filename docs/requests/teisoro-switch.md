Scalewing request from Teisoro.

Status: shipped (the base request; any follow-up below carries its own status); present in `@scalewing/react` 1.26.0, the version Teisoro pins, from an earlier release (see `packages/react/CHANGELOG.md`), checked 2026-10-11 for Teisoro F-011 (redesign inventory, section 3). Earlier status: implementation in progress under Teisoro F-002-S05 task 510.
Renderer: react
Missing surface: `Switch`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Neither Field plus an unstyled checkbox nor SegmentedControl owns the small persistent on/off control and switch semantics.
Existing surface this might already be: None.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Employee active-only and Services-report boolean filters.
Proposed API: label, checked, onCheckedChange, disabled, description.
Behavior and failure boundary: Use a native checkbox input with switch semantics and Scalewing generated styling. Space toggles once; disabled never invokes the callback. Consumer supplies localized text and authoritative filtering.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
