# ADR 0010: Web CSS generation lives in @scalewing/react

- Status: accepted by the product owner on 2026-09-21
- Amends: ADR 0003, ADR 0005, and ADR 0007 on where CSS is generated

## Decision

`@scalewing/tokens` holds only platform-neutral values, types, and pure calculations: themes, colors, named palettes, spacing, typography, radius, glass, elevation, motion, control sizes, contrast checks, and `createTheme`.

Everything web-specific moves to `@scalewing/react`, under `packages/react/src/css`:

- the generators for `styles.css`, the `sw-*` class catalog, and each named-palette CSS file
- the class-name helpers (`buttonClassNames`, `badgeClassNames`, `spacingClass`, `hideClass`) and the `breakpointScale` token
- the build step that writes `dist/styles.css` and `dist/palette/*.css`

`@scalewing/tokens` no longer exports `generateStylesheet`, `utilityClassCatalog`, those helpers, or `breakpointScale`, and no longer publishes `./styles.css` or `./palette/*.css`. `@scalewing/react` publicly exports `utilityClassCatalog`, `badgeSizes`, and `badgeTones`. Consumers keep importing `@scalewing/react/styles.css`; that path does not change.

The CSS build resolves `@scalewing/tokens` to its compiled `dist` with a small Node resolve hook, because tokens' development entry is TypeScript source.

## Rationale

Native never used the CSS. Keeping the generators in tokens meant every web CSS change bumped the package native depends on, so native saw releases with no changes for it. With independent releases (ADR 0009) the CSS layer belongs with the renderer that ships it. Doing this before `1.0.0` avoids a breaking tokens major for removing exports.

One shared values package is kept on purpose. Separate native and web token packages would duplicate palettes, colors, and spacing and let the platforms drift.

## Consequences

- The generated CSS is unchanged. All 17 generated files (`styles.css` and 16 palette files) were compared byte for byte before and after the move.
- A web CSS change is a `@scalewing/react` release. A tokens release happens only when a shared value changes.
- ADR 0003 said responsive class syntax needs a new ADR. The `sw-hide-from-md` and `sw-hide-below-md` classes are the only responsive classes, generated from the breakpoint token. Any further responsive classes need their own ADR.
- Tokens tests cover values only. CSS and class-catalog tests live with the generators in `packages/react/src/css`.
