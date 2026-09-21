Scalewing request from release tooling (all consumers).

Status: implemented and verified; pending independent review and commit. See [ADR 0010](../adr/0010-web-css-in-react.md).
Renderer: react (and tokens)
Missing surface: none. This moves existing code so web CSS generation ships with `@scalewing/react` and `@scalewing/tokens` holds only shared values.
Why existing structure cannot do this: Web CSS generators in `tokens` make every CSS change bump the package native depends on, which defeats independent releases.
Existing surface this might already be: None.
Workaround I almost used: leave the generators in tokens and accept a coordinated release of all packages for each CSS change.
Proposed design: ADR 0010.

## Moved

- `css-*.ts`, `stylesheet.ts`, `breakpoints.ts`, and `spacing-classes.ts` from `packages/tokens/src` to `packages/react/src/css` (history preserved with `git mv`).
- `buttonClassNames` from `control.ts` into `css-button.ts`.
- `scripts/write-css.js` from tokens to react, run by react's build with a resolve hook for `@scalewing/tokens`.
- CSS and class-catalog tests from tokens to react; value tests stay in tokens.

## API changes

- `@scalewing/tokens` removes `generateStylesheet`, `utilityClassCatalog`, `buttonClassNames`, `badgeClassNames`, `badgeSizes`, `badgeTones`, `BadgeSize`, `BadgeTone`, `spacingClass`, `PaddingAxis`, `GapAxis`, `paddingAxes`, `gapAxes`, `breakpointScale`, `Breakpoint`, `HideDirection`, `hideClass`, and the `./styles.css` and `./palette/*.css` exports. No published release contained `breakpointScale`, and no known consumer imports the others; FutMas imports only values and types that stay.
- `@scalewing/react` adds `utilityClassCatalog`, `badgeSizes`, and `badgeTones` (`BadgeSize` and `BadgeTone` were already exported).

## Acceptance

- [x] The generated `styles.css` and all 16 palette CSS files are byte-identical to the pre-move build (17 SHA-256 matches).
- [x] `@scalewing/tokens` `dist` contains no CSS, and its manifest exports only `.`.
- [x] Native imports nothing that moved (FutMas confirmed its imports are values and types only).
- [x] `pnpm check` passes: 22 token tests, 99 React tests, 37 native tests, and 3 gallery tests, plus builds, typechecks, and lint.
- [x] `pnpm --filter @scalewing/gallery test:browser` passes 30 Chromium runs.
- [ ] Independent review and commit.

## Non-goals

No visual change, new class, new token, or renamed export beyond the removals listed above. Native, Teisoro, and FutMas consumers need no code change.
