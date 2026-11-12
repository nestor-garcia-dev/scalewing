import { Stack, Text, ThemeProvider, useTheme } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { useGalleryPalette } from '../palette-context.js';

export function DisplayFaceSection() {
  const { colorScheme } = useTheme();
  const { palette } = useGalleryPalette();
  return (
    <Section
      id="display-face"
      purpose="ThemeProvider displayFace='condensed' sets a page's titles (hero, display, headline, heading) in the tokens' condensed face, Barlow Condensed, which the app loads; body text keeps the system face. The gallery does not load Barlow Condensed, so its titles show the narrow fallback."
      title="ThemeProvider displayFace"
      usage={`<ThemeProvider displayFace="condensed" {...theme}>
  <Text variant="hero">Every match counts.</Text>
</ThemeProvider>`}
    >
      <ThemeProvider
        colorScheme={colorScheme}
        displayFace="condensed"
        palette={palette}
      >
        <Stack gap={3} padding={4}>
          <Text as="h3" variant="hero">
            Every match counts.
          </Text>
          <Text as="h4" variant="headline">
            A table everyone trusts.
          </Text>
          <Text variant="lead">The lead keeps the system face.</Text>
        </Stack>
      </ThemeProvider>
    </Section>
  );
}
