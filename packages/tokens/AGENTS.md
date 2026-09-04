# Token agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules for tokens

1. This package is pure and deterministic. It may write `styles.css` only from `scripts/write-css.js`. Do not compile that entry into the published `dist` catalog.
2. Do not import React, React Native, Expo, `react-dom`, CSS-in-JS libraries, or example apps.
3. Semantic colors, spacing steps, typography, radius, elevation, motion, control sizes, and glass live here.
4. Generate CSS custom properties and `sw-*` classes from those tokens. Do not keep a second hand-written catalog.
5. `sw-padding-top-4` means spacing step `4`, not `4px`.
6. Fail closed on invalid theme overlays: unknown keys or empty color values.
7. Add focused unit tests for scale completeness, light/dark parity, contrast pairs, and the generated class catalog.

## Prefer

```ts
export function spacingClass(
  kind: 'padding' | 'gap',
  axis: SpacingAxis,
  step: SpacingStep,
): string {
  if (axis === 'all') {
    return `sw-${kind}-${step}`;
  }

  return `sw-${kind}-${axis}-${step}`;
}
```

## Avoid

Hardcoded pixel classes, arbitrary values, and importing renderer packages.
