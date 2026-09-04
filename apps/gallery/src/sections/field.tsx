import { Field, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function FieldSection() {
  return (
    <Section
      id="field"
      purpose="Field wraps a native control in a label and token gap. It does not restyle the control; the document canvas does."
      title="Field"
      usage={`<Field label="Scoring">
  <select>
    <option>PPR</option>
  </select>
</Field>`}
    >
      <Stack gap={3}>
        <Field label="League name">
          <input defaultValue="My league" name="league-name" />
        </Field>
        <Field label="Scoring">
          <select defaultValue="ppr" name="scoring">
            <option value="ppr">PPR</option>
            <option value="half">Half PPR</option>
            <option value="standard">Standard</option>
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
