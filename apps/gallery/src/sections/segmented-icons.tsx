import {
  GlyphTile,
  type GlyphTileHue,
  SegmentedControl,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';

const leaf =
  'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z M2 22c1.25-1.25 2.5-2.5 3.5-4';

const surveys: ReadonlyArray<{ id: string; label: string; hue: GlyphTileHue }> =
  [
    { id: 'forest', label: 'Forest', hue: 'green' },
    { id: 'lake', label: 'Lake', hue: 'blue' },
    { id: 'savanna', label: 'Savanna', hue: 'orange' },
  ];

export const surveyItems = surveys.map((item) => ({
  id: item.id,
  label: item.label,
  icon: (
    <GlyphTile hue={item.hue} size="sm">
      <Glyph grid={24} path={leaf} size={24} />
    </GlyphTile>
  ),
}));

/**
 * A switcher between kinds of survey, each marked by its tile, then the
 * same track disabled and with an error.
 */
export function SegmentedIconsExample() {
  const [survey, setSurvey] = useState('lake');
  const [retake, setRetake] = useState('forest');
  return (
    <Stack gap={3}>
      <SegmentedControl
        aria-label="Survey"
        items={surveyItems}
        onChange={setSurvey}
        value={survey}
      />
      <Text variant="label">Disabled</Text>
      <SegmentedControl
        aria-label="Closed survey"
        disabled
        items={surveyItems}
        value="savanna"
      />
      <Text variant="label">With an error</Text>
      <SegmentedControl
        aria-label="Survey to retake"
        error="Forest was surveyed this morning. Pick another."
        items={surveyItems}
        onChange={setRetake}
        value={retake}
      />
    </Stack>
  );
}
