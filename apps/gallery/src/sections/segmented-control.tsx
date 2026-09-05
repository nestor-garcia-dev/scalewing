import { SegmentedControl, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function SegmentedControlSection() {
  const [animalClass, setAnimalClass] = useState('mammals');
  const [range, setRange] = useState('forest');

  return (
    <Section
      id="segmented-control"
      purpose="SegmentedControl is one exclusive choice. Use it instead of a row of independent Buttons."
      title="SegmentedControl"
      usage={`<SegmentedControl
  aria-label="Class"
  value={animalClass}
  onChange={setAnimalClass}
  items={[
    { id: 'mammals', label: 'Mammals' },
    { id: 'birds', label: 'Birds' },
  ]}
/>`}
    >
      <Stack gap={4}>
        <SegmentedControl
          aria-label="Class"
          items={[
            { id: 'mammals', label: 'Mammals' },
            { id: 'birds', label: 'Birds' },
            { id: 'reptiles', label: 'Reptiles' },
          ]}
          onChange={setAnimalClass}
          value={animalClass}
        />
        <SegmentedControl
          aria-label="Range"
          items={[
            { id: 'forest', label: 'Forest' },
            { id: 'savanna', label: 'Savanna' },
            { id: 'ocean', label: 'Ocean' },
          ]}
          onChange={setRange}
          value={range}
        />
        <Text variant="caption">
          Selected: {animalClass} · {range}
        </Text>
      </Stack>
    </Section>
  );
}
