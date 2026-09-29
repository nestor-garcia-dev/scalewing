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
      purpose="Field labels native controls and associates optional hints, required state, and validation errors. An error is described on its control, marks it invalid, and is announced politely from a live region that is always there; it is never an alert, so several errors at once do not interrupt, and the form moves focus to the first invalid field. Validation stays with the consumer. size xs compacts the control; the canvas paints its native surface. prefix and suffix put short text such as a unit inside an input's frame; it is not part of the value and joins the accessible name, or the description when the input names itself with aria-label. A press anywhere on the frame focuses the input. A disabled control keeps its value in the text color on the quiet subtle fill with a dashed border, so a locked value stays readable and looks locked."
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
        <Field label="Wingspan" suffix="cm">
          <input defaultValue="38" inputMode="decimal" name="wingspan" />
        </Field>
        <Field
          description="Paid at the reserve gate"
          label="Reserve entry fee"
          prefix="$"
        >
          <input defaultValue="12.50" inputMode="decimal" name="entry-fee" />
        </Field>
        <Field label="Canopy cover" labelVisuallyHidden size="xs" suffix="%">
          <input defaultValue="64" inputMode="numeric" name="canopy-cover" />
        </Field>
        <Field label="Disabled control">
          <input disabled defaultValue="Cannot edit" name="disabled-control" />
        </Field>
        <Field label="Recorded habitat">
          <select defaultValue="forest" disabled name="recorded-habitat">
            {sampleHabitats.map((habitat) => (
              <option key={habitat.value} value={habitat.value}>
                {habitat.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Survey notes">
          <textarea
            defaultValue="Two adults at the forest edge."
            disabled
            name="survey-notes"
            placeholder="Add notes"
            rows={2}
          />
        </Field>
        <Field label="Counted nests" suffix="nests">
          <input
            defaultValue="12"
            disabled
            inputMode="numeric"
            name="counted-nests"
          />
        </Field>
        <Text color="muted" variant="caption">
          The label names the control. Clicking the label name focuses the
          field. Default gap is spacing step 1.
        </Text>
      </Stack>
    </Section>
  );
}
