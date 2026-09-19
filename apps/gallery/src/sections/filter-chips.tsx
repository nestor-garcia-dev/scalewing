import { Button, FilterChips, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function FilterChipsSection() {
  const [selected, setSelected] = useState('all');
  const [sightings, setSightings] = useState(42);
  const [changes, setChanges] = useState(0);
  const options = [
    { value: 'all', label: `All sightings (${sightings})` },
    { value: 'forest', label: 'Forest canopy records (18)' },
    { value: 'desert', label: 'Desert scrub (0)', disabled: true },
    {
      value: 'wetland',
      label: 'Wetland observations across the migration season (12)',
    },
    { value: 'selva', label: 'Observaciones de selva tropical (8)' },
  ];

  return (
    <Section
      id="filter-chips"
      purpose="FilterChips keeps long single-choice filter sets visible. Native radios supply arrow and Space behavior; options wrap on narrow screens and counts remain consumer-owned label text."
      title="FilterChips"
      usage={`<FilterChips label="Sighting filters" value={selected} onChange={setSelected} options={options} />`}
    >
      <Stack gap={3}>
        <FilterChips
          label="Sighting filters"
          onChange={(next) => {
            setSelected(next);
            setChanges((count) => count + 1);
          }}
          options={options}
          value={selected}
        />
        <Button
          onPress={() => setSightings((count) => count + 1)}
          variant="secondary"
        >
          Add sighting
        </Button>
        <Text color="muted" variant="caption">
          Selected filter: {selected}. Callbacks: {changes}.
        </Text>
      </Stack>
    </Section>
  );
}
