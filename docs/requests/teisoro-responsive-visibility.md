Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002 (no-custom-CSS ruling, 2026-09-21); independent review approved; awaiting publish and Teisoro pin bump.
Renderer: react
Missing surface: responsive visibility props on `Box` (`hideFrom`, `hideBelow`) backed by a `md` breakpoint token.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: No primitive can show one region on wide screens and another on narrow screens, so a product must ship its own media-query stylesheet.
Existing surface this might already be: None. `Split` collapses one pane but does not toggle arbitrary regions; `AppHeader` and `Nav` have no responsive behavior.
Workaround I almost used: a product-owned CSS file with `@media (max-width: 48rem)` classes, which is what Teisoro has today in `workspace-shell.css` (desktop link buttons versus a mobile `ActionMenu`).
Teisoro use: swap the desktop navigation buttons for the mobile `ActionMenu`, then delete `workspace-shell.css`.
Proposed API: `<Box hideBelow="md">` hides the box under the `md` breakpoint (48rem); `<Box hideFrom="md">` hides it at `md` and wider. Generated classes `sw-hide-below-md` and `sw-hide-from-md`. Breakpoints are a generated-CSS token scale (`breakpointScale` in `@scalewing/react`'s CSS layer after ADR 0010 moved web CSS out of tokens, not a public export); only `md` exists until a consumer needs another.
Behavior and failure boundary: Visibility is presentation only. Hidden regions leave the accessibility tree and tab order because they use `display: none`. Consumers must not rely on it for authorization or data exposure, and must keep the hidden and visible variants equivalent in function. Web only; React Native has no viewport media queries.

Scalewing owns the breakpoint token, generated CSS, typed props, tests, gallery evidence, and changeset. Teisoro owns the navigation content and labels and deletes its stylesheet in a later pin-bump story.

Verification on 2026-09-21: `pnpm check` passed format, lint, 30 token tests, 90 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed 30 Chromium runs across desktop English, mobile Spanish, and forced-colors, including the 767px and 768px boundary. Packed `@scalewing/tokens` and `@scalewing/react` tarballs were installed in a disposable Teisoro worktree with the shell nav switched to `hideBelow`/`hideFrom`, `workspace-shell.css` deleted, and the boundary script rejecting all Teisoro stylesheets: lint, 456 React tests at 100% coverage, build, and 35 Chromium journeys passed. The boundary check failed only its exact-pin rule because of the temporary tarball. Independent Bar Raiser review (`bar-raiser-claude`, Haiku, read-only) returned APPROVED with no findings.

## Follow-up request (2026-10-09, Teisoro F-006-S11 task 1885): an `lg` breakpoint and touch-sized navigation buttons

Status: implemented on `claude/teisoro-f006-s11-lg-breakpoint` for Teisoro F-006-S11 task 1885; pull request pending review.
Source: Teisoro UX reviews `admin-settings.md` SET-3 (the header's eight destinations show their labels from `md`, in two lines in English and three in Spanish at 768) and `closeouts-close-a-register.md` UX-16 (the phone header's destinations are 32 px tall). Teisoro's design pass (`docs/design/remaining-routes/01-shell.md`, "The destinations at every width") was approved with changes by an independent reviewer: below 64rem each destination is its glyph, named by its `Tooltip` (`relationship="label"`), and from 64rem up it shows its label; on a coarse pointer every destination is a 44 px target at every width.

Teisoro need: hide the destination's label below 64rem with Scalewing's CSS, follow the same width in script for the tooltip, and give the navigation's buttons the touch target without a Teisoro size rule.

Proposed API:

- `hideBelow` and `hideFrom` take `'lg'` (64rem) beside `'md'`: generated `sw-hide-below-lg` and `sw-hide-from-lg`. New exported type `VisibilityBreakpoint` (`'md' | 'lg'`). The layout props (`Grid columnsBelow`, `ActionBar stickyBelow`, `Dialog`'s sheet, `SectionNav verticalFrom`) keep the one layout breakpoint, `md`.
- `breakpointQuery(direction, breakpoint)` is exported: the media query a hide class uses (`breakpointQuery('below', 'lg')` is `not all and (min-width: 64rem)`), so an app's `matchMedia` follows the same width.
- A `Button` inside `Nav` is at least 44 × 44 px on a coarse pointer (`.sw-nav .sw-button`), as `SectionNav` links, `CalendarButton` and the `ActionMenu` trigger are.

Behavior and failure boundary: presentation only. An unknown `hideBelow` or `hideFrom` now throws a `RangeError` (it produced a class with no rule). The coarse-pointer rule raises only the minimum height and width, so a label beside its glyph keeps its line.

Rejected alternatives:

- `lg` in `breakpointScale` for every responsive prop. It would multiply every layout class for a need only visibility has.
- A responsive `size` on `Button`, or an icon button that hides its label. Beyond the need: the label is a `Box hideBelow`, and the name is the tooltip's.

Evidence: `visibility.test.tsx` (the `lg` classes, the refusal, the queries at 48rem and 64rem, the exported `breakpointQuery`, the coarse-pointer nav rule); `apps/gallery/e2e/responsive-visibility.spec.ts` on desktop-en, mobile-es and forced-colors: the gallery's habitat glyphs hide their labels at 1023 and show them at 1024, named and pressable at both, and are 44 px targets on the coarse pointer.
