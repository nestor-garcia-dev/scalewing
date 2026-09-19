import { RadioGroup, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const habitatOptions = [
  { value: 'forest', label: 'Forest canopy' },
  { value: 'desert', label: 'Desert scrub', disabled: true },
  {
    value: 'wetland',
    label: 'Seasonal wetland with long migration observations',
  },
] as const;

export function RadioGroupSection() {
  const [habitat, setHabitat] = useState('');
  const [changeCount, setChangeCount] = useState(0);

  return (
    <Section
      id="radio-group"
      purpose="RadioGroup presents one choice from a vertical set of longer form options. The browser supplies grouped radio keyboard behavior; the caller owns labels, values, and validation."
      title="RadioGroup"
      usage={`<RadioGroup
  legend="Habitat"
  value={habitat}
  onChange={setHabitat}
  options={habitatOptions}
  required
/>`}
    >
      <Stack gap={3}>
        <RadioGroup
          description="Choose the habitat where the sighting occurred"
          error={habitat ? undefined : 'Choose a habitat'}
          legend="Habitat"
          onChange={(next) => {
            setHabitat(next);
            setChangeCount((count) => count + 1);
          }}
          options={habitatOptions}
          required
          value={habitat}
        />
        <RadioGroup
          disabled
          legend="Archived habitat"
          onChange={() => undefined}
          options={habitatOptions}
          value="forest"
        />
        <Text color="muted" variant="caption">
          Selected habitat: {habitat || 'none'}. Callbacks: {changeCount}.
        </Text>
      </Stack>
    </Section>
  );
}
