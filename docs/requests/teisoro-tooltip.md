Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002-S05 task 570; pending final independent review and commit.
Renderer: react
Missing surface: `Tooltip`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Native title is unreliable for keyboard and touch; a product popover and CSS would duplicate overlay behavior.
Existing surface this might already be: None.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Icon-only actions and truncated explanatory content in retained operational routes.
Proposed API: content, labelled trigger or anchor.
Behavior and failure boundary: Expose help on focus and hover, support touch access, and dismiss on Escape/blur. Tooltip content supplements an accessible name rather than replacing it. Consumer supplies localized text.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

Verification on 2026-09-19: `pnpm check` passed format, lint, 30 token tests, 76 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed all 18 Chromium runs across desktop English, mobile Spanish with touch, and forced-colors projects; the Tooltip mobile screenshot was inspected after the generated stylesheet build. Built `@scalewing/tokens` and `@scalewing/react` tarballs were installed via temporary overrides in a disposable detached Teisoro worktree. `pnpm verify:react` passed lint, 346 React unit tests at 100% coverage, boundary check, build, and 25 Chromium E2E journeys. The Teisoro task records the final review fingerprint and commit hash after commit.
