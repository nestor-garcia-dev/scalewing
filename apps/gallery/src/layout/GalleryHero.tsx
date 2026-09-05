import { Stack, Text } from '@scalewing/react';

import { CodeSample } from './Section.js';

const webInstall = `pnpm add @scalewing/react
import '@scalewing/react/styles.css';
import { ThemeProvider } from '@scalewing/react';

<ThemeProvider palette="cerulean">{children}</ThemeProvider>`;

const nativeInstall = `pnpm add @scalewing/react-native
import { Card, Stack, Text, ThemeProvider } from '@scalewing/react-native';

<ThemeProvider palette="cerulean">
  <Card padding={4}>
    <Text variant="title">Match</Text>
  </Card>
</ThemeProvider>`;

export function GalleryHero() {
  return (
    <Stack gap={4}>
      <Stack gap={3}>
        <Text variant="display">
          Quiet glass for products that share a system.
        </Text>
        <Text color="muted">
          Live catalog of public `@scalewing/react`, `@scalewing/react-native`,
          and `@scalewing/tokens`. Light, Dark, and System set the scheme;
          Palette picks the named color family. This preview uses workspace
          packages, not the latest npm release.
        </Text>
      </Stack>
      <Stack gap={2}>
        <Text variant="label">Web</Text>
        <CodeSample>{webInstall}</CodeSample>
      </Stack>
      <Stack gap={2}>
        <Text variant="label">React Native</Text>
        <Text color="muted" variant="caption">
          No CSS class API. `padding={4}` is spacing step 4.
        </Text>
        <CodeSample>{nativeInstall}</CodeSample>
      </Stack>
    </Stack>
  );
}
