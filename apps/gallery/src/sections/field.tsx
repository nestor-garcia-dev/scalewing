import { Button, Field, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

export function FieldSection() {
  const [sightingName, setSightingName] = useState('');
  const [validated, setValidated] = useState(false);
  const error =
    validated && !sightingName.trim() ? 'Enter a sighting name' : undefined;

  return (
    <Section
      id="field"
      purpose="Field labels native controls and associates optional hints, required state, and validation errors. Validation stays with the consumer. size xs compacts the control; the canvas paints its native surface."
      title="Field"
      usage={`<Field label="Habitat">
  <select>
    <option>Forest</option>
  </select>
</Field>`}
    >
      <Stack gap={3}>
        <Field
          description="Use the name printed on the sighting card"
          error={error}
          label="Sighting name"
          required
        >
          <input
            name="sighting-name"
            onChange={(event) => setSightingName(event.currentTarget.value)}
            value={sightingName}
          />
        </Field>
        <Button onPress={() => setValidated(true)} variant="secondary">
          Validate sighting
        </Button>
        <Field label="Species name">
          <input defaultValue="Red fox" name="species-name" />
        </Field>
        <Field description="Choose the observation habitat" label="Habitat">
          <select defaultValue="forest" name="habitat">
            {sampleHabitats.map((habitat) => (
              <option key={habitat.value} value={habitat.value}>
                {habitat.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Compact region" labelVisuallyHidden size="xs">
          <select defaultValue="amazon" name="compact-region">
            <option value="amazon">Field Notes · Amazon</option>
          </select>
        </Field>
        <Field label="Disabled control">
          <input disabled defaultValue="Cannot edit" name="disabled-control" />
        </Field>
        <Text color="muted" variant="caption">
          The label names the control. Clicking the label name focuses the
          field. Default gap is spacing step 1.
        </Text>
      </Stack>
    </Section>
  );
}
