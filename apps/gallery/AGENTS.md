# Gallery agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules

1. This app is the Scalewing documentation gallery and pre-publish QA surface. It is not a source of tokens.
2. Import `@scalewing/react/styles.css` once at the entry. Do not copy Scalewing CSS into `src`.
3. Consume public exports from `@scalewing/react` and `@scalewing/tokens` only. Do not import package `src` internals.
4. Compose from ThemeProvider, Box, Stack, Inline, Card, Text, Button, and Field. Do not add public primitives for site chrome.
5. `gallery.css` may own sticky/responsive documentation layout and code-block presentation. It must use Scalewing CSS variables. It must not restyle showcased components or redefine the canvas, links, inputs, colors, typography, radii, shadows, or glass.
6. Show only primitives that already exist. Do not invent hex, font sizes, or spacing in JSX.
7. Do not add product domain screens, Storybook, MDX, or another visual system.

## Prefer

```ts
import '@scalewing/react/styles.css';
import { Button, Card, Stack, Text } from '@scalewing/react';
import { lightTheme } from '@scalewing/tokens';
```

## Avoid

Vendoring Scalewing CSS, importing renderer internals, and treating the gallery as a design-token source.
