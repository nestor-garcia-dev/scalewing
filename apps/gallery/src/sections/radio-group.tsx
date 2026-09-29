import { RadioGroup, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const habitatOptions = [
  { value: 'forest', label: 'Forest canopy' },
  { value: 'desert', label: 'Desert scrub', disabled: true },
  {
    value: 'wetland',
    label: 'Seasonal wetland with long migration observations',
  },
] as const;

const sourceOptions = [
  {
    value: 'observer',
    label: 'Field observer',
    icon: (
      <Glyph path="M8 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 14c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
    ),
  },
  {
    value: 'camera',
    label: 'Camera trap',
    icon: (
      <Glyph path="M2 5.5h3L6.5 3.5h3L11 5.5h3v7H2v-7ZM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    ),
  },
] as const;

export function RadioGroupSection() {
  const [habitat, setHabitat] = useState('');
  const [source, setSource] = useState('observer');
  const [changeCount, setChangeCount] = useState(0);

  return (
    <Section
      id="radio-group"
      purpose="RadioGroup presents one choice from a vertical set of longer form options. The browser supplies grouped radio keyboard behavior; the caller owns labels, values, and validation. An option's icon is a decorative glyph between the radio and its label, in the text color; the option's accessible name stays its label."
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
          legend="Sighting source"
          onChange={setSource}
          options={sourceOptions}
          value={source}
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
