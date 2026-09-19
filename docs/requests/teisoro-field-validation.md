Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002-S05 task 600; pending independent review and commit.
Renderer: react
Missing surface: `Field description and validation`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Existing Field labels children but does not own stable description/error IDs, invalid association, or generated validation styling. A second product form wrapper would duplicate this logic.
Existing surface this might already be: Field.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Closeout, employee, Services, check-cashing, and vault forms with hints and errors.
Proposed API: extend Field with description, error, required, and documented input association.
Behavior and failure boundary: Create stable IDs, announce description/error correctly, avoid duplicate or stale errors, and style invalid state from tokens. Keep validation rules in the consumer/API.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

Verification on 2026-09-19: `pnpm check` passed format, lint, 30 token tests, 86 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed 27 Chromium runs across desktop English, mobile Spanish, and forced-colors projects; the Field mobile error screenshot was inspected. Browser checks prove stable hint/error association, required and invalid states, label focus, error clearing, and a visible invalid border. Built `@scalewing/tokens` and `@scalewing/react` tarballs were installed via temporary overrides in a disposable detached Teisoro worktree. `pnpm verify:react` passed lint, 346 React unit tests at 100% coverage, boundary check, build, and 25 Chromium E2E journeys. The Teisoro task records the final review fingerprint and commit hash after commit.
