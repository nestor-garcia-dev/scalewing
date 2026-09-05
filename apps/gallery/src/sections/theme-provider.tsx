import {
  Button,
  Card,
  Stack,
  Text,
  ThemeProvider,
  useTheme,
} from '@scalewing/react';
import { darkTheme, lightTheme } from '@scalewing/tokens';

import { Section } from '../layout/Section.js';
import { useGalleryPalette } from '../palette-context.js';

function OverlayPreview() {
  const overlay = useTheme();

  return (
    <Card padding={4}>
      <Stack align="start" gap={2}>
        <Text variant="caption">
          {overlay.colorScheme} accent {overlay.colors.accent}
        </Text>
        <Button onPress={() => undefined}>Overlay save</Button>
      </Stack>
    </Card>
  );
}

export function ThemeProviderSection() {
  const theme = useTheme();
  const { palette } = useGalleryPalette();

  return (
    <Section
      id="theme-provider"
      purpose="ThemeProvider resolves light, dark, or system so end users can select a scheme. Named palettes already include both schemes. Products can also pass colors.light and colors.dark; the active scheme picks the pair. Overlaying accent retints glass. Products do not fork the class sheet."
      title="ThemeProvider"
      usage={`<ThemeProvider
  colorScheme="system"
  palette="cerulean"
  colors={{
    light: { accent: '#0B615E', onAccent: '#FFFFFF' },
    dark: { accent: '#7EDAD6', onAccent: '#101214' },
  }}
>
  {children}
</ThemeProvider>`}
    >
      <Stack gap={4}>
        <Stack align="start" gap={2}>
          <Text>
            Light, Dark, and System set the scheme. Palette sets the named color
            family. This button follows the header.
          </Text>
          <Button onPress={() => undefined}>Palette save</Button>
        </Stack>
        <Card padding={4}>
          <Stack gap={2}>
            <Text variant="label">Brand overlay</Text>
            <Text color="muted" variant="caption">
              A nested ThemeProvider can replace accent. This box is a brand
              overlay, not the header palette. Success is the light/dark pair.
              Toggle Light and Dark to see it switch.
            </Text>
            <ThemeProvider
              colorScheme={theme.colorScheme}
              colors={{
                light: {
                  accent: lightTheme.colors.success,
                  onAccent: lightTheme.colors.onAccent,
                },
                dark: {
                  accent: darkTheme.colors.success,
                  onAccent: darkTheme.colors.onAccent,
                },
              }}
              palette={palette}
            >
              <OverlayPreview />
            </ThemeProvider>
          </Stack>
        </Card>
      </Stack>
    </Section>
  );
}
