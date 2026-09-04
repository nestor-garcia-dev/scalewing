import { Box, Inline, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function CanvasSection() {
  return (
    <Section
      id="canvas"
      purpose="ThemeProvider writes data-theme. Generated CSS sets page background, type, links, and native text controls. prefers-reduced-transparency falls back to solid surface."
      title="Canvas"
      usage={`<ThemeProvider colorScheme="system">
  <Box as="a" href="#layout">Layout</Box>
</ThemeProvider>`}
    >
      <Stack gap={3}>
        <Text>
          Body copy uses the canvas type. Links in this gallery should not look
          like user-agent chrome.
        </Text>
        <Inline gap={3} wrap>
          <Box as="a" href="#layout">
            In-page canvas link
          </Box>
          <Box as="a" href="#button">
            Another canvas link
          </Box>
        </Inline>
        <Stack gap={2}>
          <input
            aria-label="Canvas text input"
            defaultValue="Native text control"
          />
          <select aria-label="Canvas select">
            <option>Native select</option>
            <option>Second option</option>
          </select>
        </Stack>
        <Text color="muted" variant="caption">
          If the OS requests reduced transparency, glass fills become
          colors.surface and backdrop-filter is disabled.
        </Text>
      </Stack>
    </Section>
  );
}
