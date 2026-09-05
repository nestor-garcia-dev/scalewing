# Scalewing

Design tokens and layout primitives for web (DOM) and React Native.

## Packages

| Package                   | Use                             |
| ------------------------- | ------------------------------- |
| `@scalewing/tokens`       | Themes, scales, generated CSS   |
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

```sh
pnpm install
pnpm check
pnpm dev:web
```

`pnpm dev:web` rebuilds tokens and `@scalewing/react` (so `styles.css` is current) then starts the gallery. Use `pnpm build:gallery` and `pnpm preview:gallery` to inspect the production bundle before tagging a release.

See `docs/CONTRIBUTING.md` for the first laptop publish and later GitLab OIDC releases. Product apps follow `docs/CONSUMER_REQUESTS.md` and file requests in `docs/requests/`.
