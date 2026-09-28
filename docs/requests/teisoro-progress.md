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

Follow-up (Teisoro F-007-S03 task 1280, 2026-09-28): `Progress` takes `showCount?: boolean` (default `true`) to hide its visible "value / max" count. UX review finding UX-15 (`docs/features/F-007-journey-suite-scale.in-progress/ux-reviews/closeouts-close-a-register.md`, "The day's progress shows the count twice"): the closeout day header shows "0 / 2" above the bar and its own localized "0 of 2 completed" below it. Teisoro keeps its sentence, which reads better in both languages, and passes `showCount={false}`. The count was already `aria-hidden` and the native `<progress>` keeps `value` and `max`, so only the visible text changes; the label, tone and range checks are unchanged. Native `Progress` keeps its count and gains no prop here; a native consumer that needs it files its own request. Evidence: `progress.test.tsx` and the Progress section's "Transects walked" bar with its own caption, checked in `apps/gallery/e2e/progress.spec.ts`. Teisoro adopts it in task 1285. Status: implemented on `claude/closeout-ux-surfaces`; pending review, merge and a `@scalewing/react` minor release.
