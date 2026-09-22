import { SegmentedControl, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function SegmentedControlSection() {
  const [animalClass, setAnimalClass] = useState('mammals');
  const [range, setRange] = useState('forest');
  const [period, setPeriod] = useState('day');

  return (
    <Section
      id="segmented-control"
      purpose="SegmentedControl is one exclusive choice. Use it instead of a row of independent Buttons. The compact variant is a quiet section switch; variant filled stretches to its container with equal segments and an accent-filled selection, for a choice that decides what a form does."
      title="SegmentedControl"
      usage={`<SegmentedControl
  aria-label="Class"
  value={animalClass}
  onChange={setAnimalClass}
  items={[
    { id: 'mammals', label: 'Mammals' },
    { id: 'birds', label: 'Birds' },
  ]}
/>

<SegmentedControl
  aria-label="Survey period"
  variant="filled"
  value={period}
  onChange={setPeriod}
  items={[
    { id: 'day', label: 'Daytime' },
    { id: 'night', label: 'Nighttime' },
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
        <SegmentedControl
          aria-label="Survey period"
          items={[
            { id: 'day', label: 'Daytime' },
            { id: 'night', label: 'Nighttime' },
          ]}
          onChange={setPeriod}
          value={period}
          variant="filled"
        />
        <Text variant="caption">
          Selected: {animalClass} · {range} · {period}
        </Text>
      </Stack>
    </Section>
  );
}
