import { Box, Button, Inline, Stack, Text } from '@scalewing/react';
import { type ReactNode } from 'react';

import { type ThemePreference } from '../theme-preference.js';
import { GalleryNav } from './GalleryNav.js';

const themeChoices: ReadonlyArray<{
  label: string;
  value: ThemePreference;
}> = [
  { label: 'Light theme', value: 'light' },
  { label: 'Dark theme', value: 'dark' },
  { label: 'System theme', value: 'system' },
];

export function GalleryShell({
  children,
  onPreferenceChange,
  preference,
}: {
  children: ReactNode;
  onPreferenceChange: (preference: ThemePreference) => void;
  preference: ThemePreference;
}) {
  return (
    <>
      <Box as="header" className="gallery-header" paddingY={3}>
        <Box className="gallery-frame" paddingX={4}>
          <Inline align="center" gap={3} justify="between" wrap>
            <Inline align="center" gap={3} wrap>
              <Text variant="title">Scalewing</Text>
              <Text color="accent" variant="label">
                Workspace preview
              </Text>
            </Inline>
            <Inline gap={2} wrap>
              {themeChoices.map((choice) => (
                <Button
                  aria-pressed={preference === choice.value}
                  key={choice.value}
                  onPress={() => onPreferenceChange(choice.value)}
                  size="sm"
                  variant={
                    preference === choice.value ? 'primary' : 'secondary'
                  }
                >
                  {choice.label}
                </Button>
              ))}
            </Inline>
          </Inline>
        </Box>
      </Box>
      <Box className="gallery-frame" padding={4} paddingTop={5}>
        <div className="gallery-body">
          <GalleryNav />
          <Box as="main">
            <Stack gap={8}>{children}</Stack>
          </Box>
        </div>
      </Box>
    </>
  );
}

export function GalleryHero() {
  return (
    <Stack gap={3}>
      <Text variant="display">
        Quiet glass for products that share a system.
      </Text>
      <Text color="muted">
        Live catalog of public `@scalewing/react` and `@scalewing/tokens`
        exports. This preview uses workspace packages, not the latest npm
        release.
      </Text>
      <pre className="gallery-code">
        <code>{`pnpm add @scalewing/react
import '@scalewing/react/styles.css';`}</code>
      </pre>
    </Stack>
  );
}
