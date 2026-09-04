# ADR 0004: Quiet glass canvas

- Status: accepted
- Date: 2026-09-04

## Decision

Scalewing’s default visual language is quiet and glass-minimal: system sans, generous space, large radius, hairline borders, and frosted surfaces. The generated stylesheet paints a document canvas on `[data-theme]` (page background, type, links, and native text controls). Card defaults to `glass`. Buttons use the pill radius.

This is not Apple’s liquid-glass shader and not a utility matrix of blur classes. Frosted fill, blur, and saturate are tokens (`theme.glass`). `prefers-reduced-transparency` falls back to solid `surface`.

## Rationale

Consuming apps were inheriting user-agent chrome (blue underlined links, unstyled inputs, default body margin). Layout primitives alone looked like a 1990s unstyled document. A generated canvas keeps brand in `@scalewing/tokens` instead of each app inventing CSS.

## Consequences

- Web ThemeProvider’s `data-theme` wrapper is the canvas. Import `@scalewing/react/styles.css` once.
- React Native approximates glass with translucent fills. Do not add BlurView as a production dependency for this.
- New glass-utility classes, gradients, or a second visual system need a new ADR.
