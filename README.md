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
import { Card, Stack, Text } from '@scalewing/react';
```

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

See `docs/CONTRIBUTING.md` for the GitLab release job. Do not publish from a laptop.
