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

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): a quiet chip without the fade

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-nsf.md`, finding NSF-1 (major, WCAG 1.4.3), the Scalewing part for quiet chips (the toggle button is `teisoro-button.md`).

The zero-count chip's face had `opacity: var(--sw-quiet-opacity)` (0.55): Teisoro's "Written off 0" filter measured 3.8:1, although the chip can be chosen.

Behavior: the quiet chip drops the glass fill (`background: transparent`) and sets its label in `--sw-color-muted`, which the token tests hold at 4.5:1 on the canvas and every named palette's surface and subtle fill (4.52:1 at the lowest). The border and the count are unchanged; the count `0` stays in the accessible name. A selected quiet chip looks like any selected chip. In forced colors the quiet chip is drawn like the others (it was `GrayText`, the system's disabled color, which it is not). No API change.

Rejected alternatives: fading only the border (the chip's frame would drop below its own boundary contrast); a dashed border (reads as a drop target or a placeholder); keeping the fade on the fill only (the glass fill is nearly white, so a faded fill shows no difference).

Evidence: `css/stylesheet.test.ts` (the muted, unfilled quiet rule; no quiet opacity in the chips' CSS); `apps/gallery/e2e/filter-chips.spec.ts` on desktop-en, mobile-es and forced-colors: the "Tundra transects 0" chip has opacity 1 and at least 4.5:1 against its painted background before and after it is chosen, and its label color differs from a counted chip's.
