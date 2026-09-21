import { Box, Card, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function ResponsiveVisibilitySection() {
  return (
    <Section
      id="responsive-visibility"
      purpose="Box hideBelow and hideFrom show one region on wide screens and another on narrow screens at the md breakpoint. Split collapses a single pane; it cannot swap regions. Hidden regions leave the accessibility tree."
      title="Responsive visibility"
      usage={`<Box hideBelow="md">Wide layout</Box>
<Box hideFrom="md">Narrow layout</Box>`}
    >
      <Card padding={4}>
        <Stack gap={3}>
          <Box hideBelow="md">
            <Text>Wide layout: forest map with every sighting labeled.</Text>
          </Box>
          <Box hideFrom="md">
            <Text>Narrow layout: forest sightings as a short list.</Text>
          </Box>
        </Stack>
      </Card>
    </Section>
  );
}
