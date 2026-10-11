import { Box, Button, Nav, Stack, Text, Tooltip } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

export function NavSection() {
  const [current, setCurrent] = useState('Forest');
  return (
    <Section
      id="nav"
      purpose="Nav is a label-size link cluster. Mark the current destination with aria-current. It is not a button group; use SegmentedControl for exclusive choices. appearance words draws its links or Buttons as plain words, the current one bold in the text color."
      title="Nav"
      usage={`<Nav aria-label="Habitats">
  <Box as="a" href="#nav" aria-current="page">Forest</Box>
  <Box as="a" href="#card">Savanna</Box>
</Nav>`}
    >
      <Stack gap={3}>
        <Nav aria-label="Example habitats">
          {sampleHabitats.map((habitat, index) => (
            <Box
              aria-current={index === 0 ? 'page' : undefined}
              as="a"
              href={index === 0 ? '#nav' : '#card'}
              key={habitat.value}
            >
              {habitat.label}
            </Box>
          ))}
        </Nav>
        <Text color="muted" variant="caption">
          Current page uses aria-current. Product routers still own client
          navigation.
        </Text>
        <Nav appearance="words" aria-label="Field stations">
          {['Forest', 'Wetland'].map((station) => (
            <Button
              aria-current={station === current ? 'page' : undefined}
              key={station}
              onPress={() => setCurrent(station)}
              size="sm"
              variant={station === current ? 'primary' : 'ghost'}
            >
              {station}
            </Button>
          ))}
          <Tooltip
            content="The tide pools and the dunes"
            trigger={
              <Button
                aria-current={current === 'Coast' ? 'page' : undefined}
                onPress={() => setCurrent('Coast')}
                size="sm"
                variant={current === 'Coast' ? 'primary' : 'ghost'}
              >
                <Glyph path="M2 11c2-2 4-2 6 0s4 2 6 0M2 7c2-2 4-2 6 0s4 2 6 0" />
                Coast
              </Button>
            }
          />
          <Button disabled onPress={() => setCurrent('Glacier')} size="sm">
            Glacier
          </Button>
          <Box as="a" href="#nav">
            Field log
          </Box>
        </Nav>
        <Text color="muted" variant="caption">
          appearance words sets every destination as plain words: the current
          one in the text color at label weight, the others muted, no fill.
          Buttons (a glyph beside its words, one in a Tooltip, one disabled) and
          links read the same. Keep each destination's words visible: a glyph
          alone has no weight to change.
        </Text>
      </Stack>
    </Section>
  );
}
