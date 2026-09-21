# Scalewing

Design tokens and layout primitives for web (DOM) and React Native.

Built by [Nestor Garcia](https://github.com/nestor-garcia-dev/portfolio) to share a consistent visual foundation across independent applications. Scalewing is actively developed and MIT licensed.

## Why Scalewing

Shared colors and spacing should not require every application to maintain its own stylesheet or force web and native components into the same implementation. Scalewing keeps theme and token logic independent of rendering, generates web CSS from that source, and provides separate DOM and React Native components.

- Pure token calculations can be tested without a browser or native runtime.
- Applications consume package exports and own their product-specific layouts and copy.
- The gallery demonstrates existing components, palettes, and meaningful interaction states.

For an engineering walkthrough, start with [architecture](docs/ARCHITECTURE.md), then explore `packages/tokens`, the renderer packages, and `apps/gallery`.

## Packages

| Package                   | Use                             |
| ------------------------- | ------------------------------- |
| `@scalewing/tokens`       | Themes, scales, shared values   |
| `@scalewing/react`        | DOM components and `styles.css` |
| `@scalewing/react-native` | React Native components         |

## Web

```ts
import '@scalewing/react/styles.css';
import { Box, Button, Card, Field, Stack, Text, ThemeProvider } from '@scalewing/react';

<ThemeProvider palette="cerulean">{children}</ThemeProvider>
```

Optional CSS-only path: `import '@scalewing/react/palette/cerulean.css'` after the stylesheet, or set `data-palette="cerulean"` on the `data-theme` node.

```html
<section class="sw-padding-4 sw-padding-top-2"></section>
```

The CSS lives in the package (`node_modules`). Do not copy it into your app.

`sw-padding-top-4` is spacing step **4** (16px in the default scale), not 4px.

## React Native

```ts
import { Card, Stack, Text } from '@scalewing/react-native';

<Card padding={4}>
  <Text variant="title">Match</Text>
</Card>
```

Native has no CSS classes. Use the same spacing steps as props.

## Development

Use Node 22.23.2 and pnpm 11.19.0 (the pinned versions used by GitHub checks).

```sh
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm dev:web
```

Open the local URL printed by Vite to explore the gallery. No hosted account or backend is required. `pnpm check` runs formatting, lint, tests, builds, and type checking, including release-tag validation tests.

`pnpm dev:web` rebuilds tokens and `@scalewing/react` (so `styles.css` is current) then starts the gallery. Use `pnpm build:gallery` and `pnpm preview:gallery` to inspect the production bundle before tagging a release.

See [Contributing](docs/CONTRIBUTING.md) for development and explicit npm releases through GitHub Actions. Product apps follow [Consumer requests](docs/CONSUMER_REQUESTS.md): write `docs/requests/`, implement in this checkout, and verify with a local link before publishing.
