import { Select, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

export function SelectSection() {
  const [range, setRange] = useState('forest');
  const [compact, setCompact] = useState('savanna');

  return (
    <Section
      id="select"
      purpose="Select is a labeled listbox menu painted with the canvas. Field wraps a native OS picker; that open list cannot be themed. action is a last command in the list; it does not become the value."
      title="Select"
      usage={`<Select
  label="Watch range"
  value={range}
  onChange={setRange}
  options={sampleHabitats}
  action={{ label: 'Log a visit', onPress }}
/>`}
    >
      <Stack gap={3}>
        <Select
          label="Watch range"
          onChange={setRange}
          options={sampleHabitats}
          value={range}
        />
        <Select
          action={{
            label: 'Log a visit',
            onPress: () => undefined,
          }}
          label="Compact range"
          labelVisuallyHidden
          onChange={setCompact}
          options={sampleHabitats}
          size="xs"
          value={compact}
        />
        <Text color="muted" variant="caption">
          The closed trigger matches Field. The open list is glass, not the
          operating system menu. action is the last option and stays a command.
        </Text>
      </Stack>
    </Section>
  );
}
