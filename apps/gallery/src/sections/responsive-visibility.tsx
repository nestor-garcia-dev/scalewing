import { Box, Button, Card, Nav, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const habitats = [
  {
    name: 'Wetlands',
    path: 'M2 11c2-2 4 2 6 0s4 2 6 0 M2 7c2-2 4 2 6 0s4 2 6 0',
  },
  { name: 'Forest', path: 'M8 2l4 6H4z M8 6l5 7H3z M8 13v2' },
  { name: 'Coast', path: 'M2 12c3-3 5 0 7-2s3-4 5-4 M2 14h12' },
];

export function ResponsiveVisibilitySection() {
  const [habitat, setHabitat] = useState('none');
  return (
    <Section
      id="responsive-visibility"
      purpose="Box hideBelow and hideFrom show one region on wide screens and another on narrow screens. md (48rem) separates a phone from a wider screen; lg (64rem) is for content that fits only from a laptop up, such as a row of labelled destinations that a tablet shows as glyphs (give each glyph-only control its name, for example with Tooltip relationship label). A button in a Nav is a 44 px target on a coarse pointer at any size. breakpointQuery gives the same query to script, for matchMedia. Split collapses a single pane; it cannot swap regions. Hidden regions leave the accessibility tree."
      title="Responsive visibility"
      usage={`<Box hideBelow="md">Wide layout</Box>
<Box hideFrom="md">Narrow layout</Box>

<Button aria-label="Wetlands" onPress={openWetlands} variant="ghost">
  <WavesIcon aria-hidden />
  <Box as="span" hideBelow="lg">Wetlands</Box>
</Button>`}
    >
      <Card padding={4}>
        <Stack gap={3}>
          <Box hideBelow="md">
            <Text>Wide layout: forest map with every sighting labeled.</Text>
          </Box>
          <Box hideFrom="md">
            <Text>Narrow layout: forest sightings as a short list.</Text>
          </Box>
          <Nav aria-label="Habitats">
            {habitats.map(({ name, path }) => (
              <Button
                aria-label={name}
                key={name}
                onPress={() => setHabitat(name)}
                size="sm"
                variant="ghost"
              >
                <Glyph path={path} />
                <Box as="span" hideBelow="lg">
                  {name}
                </Box>
              </Button>
            ))}
          </Nav>
          <Text color="muted" variant="caption">
            Opened: {habitat}. The labels show from lg (64rem) up.
          </Text>
        </Stack>
      </Card>
    </Section>
  );
}
