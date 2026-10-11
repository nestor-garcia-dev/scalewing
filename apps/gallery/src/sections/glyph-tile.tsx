import {
  GlyphTile,
  type GlyphTileHue,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';
import { categoricalColorKeys } from '@scalewing/tokens';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const leaf =
  'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z M2 22c1.25-1.25 2.5-2.5 3.5-4';

const habitats: ReadonlyArray<{ hue: GlyphTileHue; name: string }> = [
  { hue: 'green', name: 'Forest' },
  { hue: 'blue', name: 'Lake' },
  { hue: 'orange', name: 'Savanna' },
  { hue: 'purple', name: 'Heath' },
  { hue: 'teal', name: 'Reef' },
  { hue: 'rose', name: 'Marsh' },
  { hue: 'neutral', name: 'Field station' },
];

export function GlyphTileSection() {
  return (
    <Section
      id="glyph-tile"
      purpose="GlyphTile is a small rounded square in a categorical colour holding the consumer's glyph in white: the mark of a kind beside its name. The hues (green, blue, orange, purple, teal, rose, and neutral) come from @scalewing/tokens and tell kinds apart without meaning; each keeps a white glyph at 3:1. It is decorative, so the visible name beside it carries the meaning. Sizes sm 24, md 28 and lg 32."
      title="GlyphTile"
      usage={`<Inline gap={2} align="center">
  <GlyphTile hue="teal"><Waves /></GlyphTile>
  <Text>Reef</Text>
</Inline>

<GlyphTile hue="neutral" size="lg"><Plus /></GlyphTile>`}
    >
      <Stack gap={4}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Inline data-testid={`glyph-tiles-${size}`} gap={2} key={size} wrap>
            {categoricalColorKeys.map((hue) => (
              <GlyphTile hue={hue} key={hue} size={size}>
                <Glyph grid={24} path={leaf} size={24} />
              </GlyphTile>
            ))}
          </Inline>
        ))}
        <Stack gap={2}>
          {habitats.map((habitat) => (
            <Inline align="center" gap={2} key={habitat.hue}>
              <GlyphTile hue={habitat.hue} size="sm">
                <Glyph grid={24} path={leaf} size={24} />
              </GlyphTile>
              <Text>{habitat.name}</Text>
            </Inline>
          ))}
        </Stack>
        <Text color="muted" variant="caption">
          The glyph is drawn at spacing step 4 whatever its own size, in white;
          the tile is aria-hidden. Forced colors draw its edge.
        </Text>
      </Stack>
    </Section>
  );
}
