# ADR 0007: Named palettes

- Status: accepted
- Date: 2026-09-05

## Decision

Scalewing publishes a bounded catalog of **named palettes**. Each palette is a light/dark overlay on existing semantic color keys (and glass derived from the merged accent). The default remains electric indigo (ADR 0004).

Consumers apply a palette in one of three ways:

1. `<ThemeProvider palette="cerulean">` (web and React Native).
2. `data-palette="cerulean"` on the same node as `data-theme`, after importing `@scalewing/react/styles.css`.
3. `import '@scalewing/react/palette/cerulean.css'` after `styles.css`, which overrides `:root` / `[data-theme]` variables without the attribute.

Palette CSS is generated from `@scalewing/tokens` palette data by `@scalewing/react` (ADR 0010). It is not a second class sheet, a color-utility matrix, or a per-product skin. `colors` on `createTheme` / `ThemeProvider` still wins over a named palette. `colors` may be a flat semantic map or `{ light, dark }` so a product declares both schemes and `colorScheme` (including `system`) selects the pair. Success and danger stay the semantic pair unless a product overlays them.

Retro palettes overlay `background` (cream or dark grounds). Light glass fill stays white.

## Rationale

Products were copying hex into `ThemeProvider` or app CSS to leave indigo. A named catalog lets any client pick a reviewed pair that already meets the 4.5:1 floor. `data-theme` stays light/dark. `data-palette` is the named overlay so the two jobs do not share one attribute.

Azure and other pastels that fail as links on white are not in the catalog.

## Consequences

- New palettes are a versioned token API: tests, generated CSS, gallery, changeset.
- CSS-only apps must not also use a ThemeProvider that inlines the default indigo unless `palette` matches.
- React Native has no CSS files; it uses the same `palette` prop on ThemeProvider.
