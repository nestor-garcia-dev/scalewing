Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002 (no-custom-CSS ruling, 2026-09-21); independent review approved; awaiting publish and Teisoro pin bump.
Renderer: react
Missing surface: responsive visibility props on `Box` (`hideFrom`, `hideBelow`) backed by a `md` breakpoint token.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: No primitive can show one region on wide screens and another on narrow screens, so a product must ship its own media-query stylesheet.
Existing surface this might already be: None. `Split` collapses one pane but does not toggle arbitrary regions; `AppHeader` and `Nav` have no responsive behavior.
Workaround I almost used: a product-owned CSS file with `@media (max-width: 48rem)` classes, which is what Teisoro has today in `workspace-shell.css` (desktop link buttons versus a mobile `ActionMenu`).
Teisoro use: swap the desktop navigation buttons for the mobile `ActionMenu`, then delete `workspace-shell.css`.
Proposed API: `<Box hideBelow="md">` hides the box under the `md` breakpoint (48rem); `<Box hideFrom="md">` hides it at `md` and wider. Generated classes `sw-hide-below-md` and `sw-hide-from-md`. Breakpoints are a token scale exported from `@scalewing/tokens`; only `md` exists until a consumer needs another.
Behavior and failure boundary: Visibility is presentation only. Hidden regions leave the accessibility tree and tab order because they use `display: none`. Consumers must not rely on it for authorization or data exposure, and must keep the hidden and visible variants equivalent in function. Web only; React Native has no viewport media queries.

Scalewing owns the breakpoint token, generated CSS, typed props, tests, gallery evidence, and changeset. Teisoro owns the navigation content and labels and deletes its stylesheet in a later pin-bump story.

Verification on 2026-09-21: `pnpm check` passed format, lint, 30 token tests, 90 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed 30 Chromium runs across desktop English, mobile Spanish, and forced-colors, including the 767px and 768px boundary. Packed `@scalewing/tokens` and `@scalewing/react` tarballs were installed in a disposable Teisoro worktree with the shell nav switched to `hideBelow`/`hideFrom`, `workspace-shell.css` deleted, and the boundary script rejecting all Teisoro stylesheets: lint, 456 React tests at 100% coverage, build, and 35 Chromium journeys passed. The boundary check failed only its exact-pin rule because of the temporary tarball. Independent Bar Raiser review (`bar-raiser-claude`, Haiku, read-only) returned APPROVED with no findings.
