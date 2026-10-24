import { Band, Box, Text, ThemeProvider, useTheme } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { useGalleryPalette } from '../palette-context.js';

export function ThemeFrameSection() {
  const { colorScheme } = useTheme();
  const { palette } = useGalleryPalette();
  return (
    <Section
      id="theme-frame"
      purpose="ThemeProvider frame='site' makes the themed root a public site's page: a column at least the window's height whose last child, the footer, sits at its foot, so a short page's footer meets the window's foot. The demo's frame is a fixed height to stand in for the window."
      title="ThemeProvider frame"
      usage={`<ThemeProvider frame="site" {...theme}>
  <SiteHeader … />
  <main>…</main>
  <SiteFooter … />
</ThemeProvider>`}
    >
      <div className="gallery-frame-demo">
        <ThemeProvider colorScheme={colorScheme} frame="site" palette={palette}>
          <Box as="header" padding={3}>
            <Text variant="label">Wetland Trust</Text>
          </Box>
          <Box padding={3}>
            <Text>One short page.</Text>
          </Box>
          <Band as="footer" paddingY={4} tone="subtle">
            <Text color="muted" variant="caption">
              © Wetland Trust
            </Text>
          </Band>
        </ThemeProvider>
      </div>
    </Section>
  );
}
