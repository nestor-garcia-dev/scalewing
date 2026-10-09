import {
  Box,
  Button,
  Card,
  Nav,
  Stack,
  Text,
  Tooltip,
  breakpointQuery,
} from '@scalewing/react';
import { useState, useSyncExternalStore } from 'react';

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

const belowLg = breakpointQuery('below', 'lg');

/** The query `hideBelow="lg"` uses, or none where there is no matchMedia. */
function belowLgList(): MediaQueryList | null {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia(belowLg)
    : null;
}

/** Whether the screen is below lg, by the query `hideBelow="lg"` uses. */
function useBelowLg(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = belowLgList();
      list?.addEventListener('change', onChange);
      return () => list?.removeEventListener('change', onChange);
    },
    () => belowLgList()?.matches ?? false,
    () => false,
  );
}

export function ResponsiveVisibilitySection() {
  const [habitat, setHabitat] = useState('none');
  const glyphsOnly = useBelowLg();
  return (
    <Section
      id="responsive-visibility"
      purpose="Box hideBelow and hideFrom show one region on wide screens and another on narrow screens. md (48rem) separates a phone from a wider screen; lg (64rem) is for content that fits only from a laptop up, such as a row of labelled destinations that a tablet shows as glyphs. Name each glyph-only control, here with Tooltip relationship label, switched on by script that follows breakpointQuery, the very query the hide class uses. A Button in a Nav is a 44 px target on a coarse pointer at any size. Split collapses a single pane; it cannot swap regions. Hidden regions leave the accessibility tree."
      title="Responsive visibility"
      usage={`<Box hideBelow="md">Wide layout</Box>
<Box hideFrom="md">Narrow layout</Box>

// your app's matchMedia hook, on the very query hideBelow="lg" uses
const glyphsOnly = useMediaQuery(breakpointQuery('below', 'lg'));
<Nav aria-label="Habitats">
  <Tooltip
    content="Wetlands"
    disabled={!glyphsOnly}
    relationship="label"
    trigger={
      <Button onPress={openWetlands} size="sm" variant="ghost">
        <WavesIcon aria-hidden />
        <Box as="span" hideBelow="lg">Wetlands</Box>
      </Button>
    }
  />
</Nav>`}
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
              <Tooltip
                content={name}
                disabled={!glyphsOnly}
                key={name}
                relationship="label"
                trigger={
                  <Button
                    onPress={() => setHabitat(name)}
                    size="sm"
                    variant="ghost"
                  >
                    <Glyph path={path} />
                    <Box as="span" hideBelow="lg">
                      {name}
                    </Box>
                  </Button>
                }
              />
            ))}
          </Nav>
          <Box hideFrom="lg">
            <Text color="muted" variant="caption">
              Below lg: each habitat is its glyph; hover or a keyboard focus
              shows its name.
            </Text>
          </Box>
          <Text color="muted" variant="caption">
            Opened: {habitat}.
          </Text>
        </Stack>
      </Card>
    </Section>
  );
}
