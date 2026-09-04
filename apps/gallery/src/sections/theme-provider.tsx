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

export function ThemeProviderSection() {
  const theme = useTheme();
  const source = theme.colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Section
      id="theme-provider"
      purpose="ThemeProvider resolves light, dark, or system and overlays brand colors on existing semantic keys. Products do not fork the class sheet."
      title="ThemeProvider"
      usage={`<ThemeProvider colorScheme="system" colors={{ accent: lightTheme.colors.success }}>
  <Button onPress={() => undefined}>Save</Button>
</ThemeProvider>`}
    >
      <Stack gap={3}>
        <Text>
          Use the Light, Dark, and System controls in the header. System follows
          the operating-system preference.
        </Text>
        <Card padding={4}>
          <Stack gap={2}>
            <Text variant="label">Accent overlay</Text>
            <Text color="muted">
              Nested provider reuses the success token as accent. That is a
              product overlay, not a second visual system.
            </Text>
            <ThemeProvider
              colorScheme={theme.colorScheme}
              colors={{
                accent: source.colors.success,
                onAccent: source.colors.onAccent,
              }}
            >
              <Button onPress={() => undefined}>Overlay save</Button>
            </ThemeProvider>
          </Stack>
        </Card>
      </Stack>
    </Section>
  );
}
