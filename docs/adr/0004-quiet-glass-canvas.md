# ADR 0004: Quiet glass canvas

- Status: accepted
- Date: 2026-09-04
- Amended: `2026-09-04` (light canvas and glass fills are white; accent stays on interactive chrome)

## Decision

Scalewing’s default visual language is quiet: system sans, generous space, large radius, hairline borders. The generated stylesheet paints a document canvas on `[data-theme]` (page background, type, links, and native text controls). Card defaults to `glass`. Buttons use the pill radius.

The default **accent** is electric indigo (`#5B3DF5` light, `#A78BFA` dark) so it does not sit next to semantic `success` green. The **light** canvas, glass fill, and secondary buttons are **opaque white** with a hairline border. Accent is for links, primary buttons, and focus — not a lavender wash on every card. Dark glass fill remains translucent and may mix a trace of accent. `prefers-reduced-transparency` still falls back to solid `surface`.

Default type and control sizes stay airy. Compact `xs` controls and `data` type are opt-in (ADR 0006).

Products may overlay semantic hex via `ThemeProvider` / `createTheme`. Overlaying `accent` retints **dark** glass; light glass stays white. `createTheme` recomputes `theme.glass` after the merge.

## Rationale

Consuming apps were inheriting user-agent chrome (blue underlined links, unstyled inputs, default body margin). Layout primitives alone looked like a 1990s unstyled document. A generated canvas keeps brand in `@scalewing/tokens` instead of each app inventing CSS.

Teal-green accent collided with success/danger on data boards. Accent-tinted light glass washed the page lavender and dropped muted-text contrast. White surfaces restore readable captions without a second visual system.

## Consequences

- Web ThemeProvider’s `data-theme` wrapper is the canvas and must publish color **and** glass CSS variables.
- React Native approximates glass with fills. Do not add BlurView as a production dependency for this.
- New glass-utility class families, extra blurs, or a second visual system still need a new ADR.
