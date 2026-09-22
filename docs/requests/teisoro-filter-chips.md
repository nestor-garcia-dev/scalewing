Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002-S05 task 590; pending independent review and commit.
Renderer: react
Missing surface: `FilterChips`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: SegmentedControl is compact and currently non-wrapping; Select hides the full filter set. Recreating chips in Teisoro would duplicate selection and visual logic.
Existing surface this might already be: SegmentedControl.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Single-choice Services, NSF, and vault dashboard filters with counts.
Proposed API: label, value, onChange, options (value, label, disabled).
Behavior and failure boundary: Wrap responsively, expose one selected choice through radiogroup semantics, and support keyboard, focus, disabled options, and long localized labels. Counts are part of consumer labels.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

Verification on 2026-09-19: `pnpm check` passed format, lint, 30 token tests, 82 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed 24 Chromium runs across desktop English, mobile Spanish, and forced-colors projects; the FilterChips mobile screenshot was inspected. Browser checks cover wrapping, long localized labels, arrow and Space behavior, disabled exclusion, one selected option, and changing counts. Built `@scalewing/tokens` and `@scalewing/react` tarballs were installed via temporary overrides in a disposable detached Teisoro worktree. `pnpm verify:react` passed lint, 346 React unit tests at 100% coverage, boundary check, build, and 25 Chromium E2E journeys. The Teisoro task records the final review fingerprint and commit hash after commit.

Follow-up request (2026-09-22, Teisoro F-002-S21 task 800): `count` on `FilterChipOption`.
Status: implemented; pending independent review and packed-consumer verification.
Missing surface: an optional non-negative integer `count` per option, rendered as a tabular chicklet after the label, and a quiet rendering (token opacity) for a chip whose count is zero until it is selected.
Why the label string cannot do this: a count baked into the label is not tabular, is formatted by hand per consumer, and cannot be styled or quieted separately from the label. The frozen Angular Services day filters show a count on every chip and mute empty ones (Teisoro `docs/design/services-day/05-filters.md`).
Workaround I almost used: the previous consumer-owned convention of appending "(count)" to the label, plus a product class for empty chips.
Proposed API: `FilterChipOption.count?: number`; negative or fractional counts throw a `RangeError`.
