# Token agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules for tokens

1. This package is pure and deterministic and contains no CSS, class names, or breakpoints. Web CSS generation lives in `@scalewing/react` (ADR 0010).
2. Do not import React, React Native, Expo, `react-dom`, CSS-in-JS libraries, or example apps.
3. Semantic colors, named palettes, spacing steps, typography, radius, elevation, motion, control sizes, and glass live here.
4. `@scalewing/react` generates CSS custom properties and `sw-*` classes from those tokens. Do not keep a second hand-written catalog here or there.
5. `sw-padding-top-4` means spacing step `4`, not `4px`.
6. Fail closed on invalid theme overlays: unknown keys or empty color values.
7. Add focused unit tests for scale completeness, light/dark parity, and contrast pairs. Class catalog and CSS tests live in `packages/react/src/css`.

## Prefer

```ts
export function spacingPx(step: SpacingStep): string {
  return `${spacingScale[step]}px`;
}
```

## Avoid

Hardcoded pixel classes, arbitrary values, and importing renderer packages.
