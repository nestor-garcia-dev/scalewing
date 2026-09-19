Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S05 task 550; pending review and packed-consumer verification.
Renderer: react
Missing surface: `Spinner`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: A product CSS animation would recreate the Material spinner in Teisoro; Progress is for measured completion.
Existing surface this might already be: Progress.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Indeterminate loading across closeout, employee, NSF, check-cashing, drawer, and vault pages.
Proposed API: label, size, decorative.
Behavior and failure boundary: Generate styling from tokens, provide accessible status text once, hide decorative instances, and respect reduced motion.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.
