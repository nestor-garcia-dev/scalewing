import { Button, Field, Inline, Stack, Text } from '@scalewing/react';
import { useId, useState } from 'react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

/**
 * Two counts checked as one group: when they add up to nothing, each field
 * is marked invalid and the group's one message sits under them.
 */
function NestCounts() {
  const [eggs, setEggs] = useState('');
  const [chicks, setChicks] = useState('');
  const [checked, setChecked] = useState(false);
  const headingId = useId();
  const messageId = useId();
  const total = (Number(eggs) || 0) + (Number(chicks) || 0);
  const invalid = checked && total === 0;
  return (
    <Stack gap={2}>
      <Stack aria-labelledby={headingId} gap={2} role="group">
        <Text as="span" color="muted" id={headingId} variant="label">
          Nest count
        </Text>
        <Inline gap={3}>
          <Field invalid={invalid} label="Eggs">
            <input
              aria-describedby={invalid ? messageId : undefined}
              inputMode="numeric"
              name="eggs"
              onChange={(event) => setEggs(event.currentTarget.value)}
              value={eggs}
            />
          </Field>
          <Field invalid={invalid} label="Chicks">
            <input
              aria-describedby={invalid ? messageId : undefined}
              inputMode="numeric"
              name="chicks"
              onChange={(event) => setChicks(event.currentTarget.value)}
              value={chicks}
            />
          </Field>
        </Inline>
        <Text
          aria-live="polite"
          color="danger"
          id={messageId}
          variant="caption"
        >
          {invalid ? 'Count at least one egg or chick.' : ''}
        </Text>
      </Stack>
      <Button onPress={() => setChecked(true)} variant="secondary">
        Check nest count
      </Button>
    </Stack>
  );
}

export function FieldSection() {
  const [sightingName, setSightingName] = useState('');
  const [validated, setValidated] = useState(false);
  const error =
    validated && !sightingName.trim() ? 'Enter a sighting name' : undefined;

  return (
    <Section
      id="field"
      purpose="Field labels native controls and associates optional hints, required state, and validation errors. An error is described on its control, marks it invalid, and is announced politely from a live region that is always there; it is never an alert, so several errors at once do not interrupt, and the form moves focus to the first invalid field. Validation stays with the consumer. size xs compacts the control; the canvas paints its native surface. prefix and suffix put short text such as a unit inside an input's frame; it is not part of the value and joins the accessible name, or the description when the input names itself with aria-label. A press anywhere on the frame focuses the input. A disabled control keeps its value in the text color on the quiet subtle fill with a dashed border, so a locked value stays readable and looks locked. invalid marks a control invalid without a message of its own, for fields whose one error is shown under their group."
      title="Field"
      usage={`<Field label="Habitat">
  <select>
    <option>Forest</option>
  </select>
</Field>

<Field invalid={noNests} label="Eggs">
  <input aria-describedby="nest-error" />
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
        <NestCounts />
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
