import { Box, Nav, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

export function NavSection() {
  return (
    <Section
      id="nav"
      purpose="Nav is a label-size link cluster. Mark the current destination with aria-current. It is not a button group; use SegmentedControl for exclusive choices."
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
      </Stack>
    </Section>
  );
}
