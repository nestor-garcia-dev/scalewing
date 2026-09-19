Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002-S05 task 580; pending independent review and commit.
Renderer: react
Missing surface: `Separator`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: A hand-styled hr or border in each product would duplicate a reusable token-based visual rule.
Existing surface this might already be: None.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Menu groups and operational form/detail sections.
Proposed API: orientation, decorative.
Behavior and failure boundary: Render a semantic separator when meaningful and a hidden decorative divider otherwise. Generate its color and thickness from tokens.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

Verification on 2026-09-19: `pnpm check` passed format, lint, 30 token tests, 79 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed 21 Chromium runs across desktop English, mobile Spanish, and forced-colors projects; the Separator mobile screenshot was inspected, and the browser checks cover light/dark token color changes. Built `@scalewing/tokens` and `@scalewing/react` tarballs were installed via temporary overrides in a disposable detached Teisoro worktree. `pnpm verify:react` passed lint, 346 React unit tests at 100% coverage, boundary check, build, and 25 Chromium E2E journeys. The Teisoro task records the final review fingerprint and commit hash after commit.
