import {
  GlyphTile,
  Inline,
  type GlyphTileHue,
  MultiSelect,
  type MultiSelectOption,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const leaf =
  'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z M2 22c1.25-1.25 2.5-2.5 3.5-4';

const habitats: ReadonlyArray<{
  value: string;
  label: string;
  hue: GlyphTileHue;
}> = [
  { value: 'forest', label: 'Forest', hue: 'green' },
  { value: 'lake', label: 'Lake', hue: 'blue' },
  { value: 'savanna', label: 'Savanna', hue: 'orange' },
  { value: 'reef', label: 'Reef', hue: 'teal' },
];

const options: MultiSelectOption[] = [
  ...habitats.map((habitat) => ({
    value: habitat.value,
    label: habitat.label,
    icon: (
      <GlyphTile hue={habitat.hue} size="sm">
        <Glyph grid={24} path={leaf} size={24} />
      </GlyphTile>
    ),
  })),
  {
    value: 'station',
    label: 'Station moves',
    separatorBefore: true,
    icon: (
      <GlyphTile hue="neutral" size="sm">
        <Glyph grid={24} path="M12 5v14M5 12h14" size={24} />
      </GlyphTile>
    ),
  },
];

function summaryOf(value: readonly string[]): string {
  if (value.length === options.length) return 'All sightings';
  if (value.length === 0) return 'Nothing';
  if (value.length === 1)
    return options.find((option) => option.value === value[0])!.label;
  return `${value.length} kinds`;
}

export function MultiSelectSection() {
  const [shown, setShown] = useState<string[]>(
    options.map((option) => option.value),
  );
  const [end, setEnd] = useState<string[]>(['forest', 'lake']);

  return (
    <Section
      id="multi-select"
      purpose="MultiSelect is several choices from a short list behind one trigger: the muted label, then a summary the page writes, then a chevron. It opens a panel named by the label with All, Clear and a native checkbox per option, an optional mark before each label (a GlyphTile, never a bare dot) and a hairline before a separated option. It is a disclosure, not a listbox: the first checkbox takes focus, Escape closes it and returns to the trigger, and focus or a press outside closes it. onChange reports the checked values in the options' order."
      title="MultiSelect"
      usage={`<MultiSelect
  label="Show"
  summary={summary}
  options={[
    { value: 'forest', label: 'Forest', icon: <GlyphTile hue="green" size="sm"><Trees /></GlyphTile> },
    …
    { value: 'station', label: 'Station moves', separatorBefore: true },
  ]}
  value={shown}
  onChange={setShown}
  allLabel="All"
  clearLabel="Clear"
/>`}
    >
      <Stack gap={3}>
        <MultiSelect
          allLabel="All"
          clearLabel="Clear"
          label="Show"
          onChange={setShown}
          options={options}
          summary={summaryOf(shown)}
          value={shown}
        />
        <Text color="muted" data-testid="multi-select-shown" variant="caption">
          Showing: {shown.length ? shown.join(', ') : 'nothing'}
        </Text>
        <Text variant="label">Disabled while the list reloads</Text>
        <MultiSelect
          allLabel="All"
          clearLabel="Clear"
          disabled
          label="Include"
          onChange={() => {}}
          options={options}
          summary="Every habitat"
          value={options.map((option) => option.value)}
        />
        <Text variant="label">At the end of a row (align end)</Text>
        <Inline justify="end">
          <MultiSelect
            align="end"
            allLabel="All"
            clearLabel="Clear"
            label="Filter"
            onChange={setEnd}
            options={options}
            summary={summaryOf(end)}
            value={end}
          />
        </Inline>
      </Stack>
    </Section>
  );
}
