Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S05 task 560; pending review and packed-consumer verification.
Renderer: react
Missing surface: `Progress`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Spinner cannot represent a known numerator and denominator; a raw progress control needs Scalewing-owned styling.
Existing surface this might already be: Spinner.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Daily closeout completion count across registers.
Proposed API: label, value, max, tone.
Behavior and failure boundary: Expose a numeric progressbar or native progress element with value/max semantics. Validate invalid ranges and preserve high-contrast readability.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
