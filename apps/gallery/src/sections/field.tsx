import { Field, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

export function FieldSection() {
  return (
    <Section
      id="field"
      purpose="Field wraps a native control in a label and token gap. size xs compacts the control. labelVisuallyHidden keeps the accessible name without a stacked caption. The document canvas paints the control, including the native select chevron and accent focus. Use Select when the open list must match the canvas."
      title="Field"
      usage={`<Field label="Habitat">
  <select>
    <option>Forest</option>
  </select>
</Field>`}
    >
      <Stack gap={3}>
        <Field label="Species name">
          <input defaultValue="Red fox" name="species-name" />
        </Field>
        <Field label="Habitat">
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
          The label wraps the control. Clicking the label name focuses the
          field. Default gap is spacing step 1.
        </Text>
      </Stack>
    </Section>
  );
}
