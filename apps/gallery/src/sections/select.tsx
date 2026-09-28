import {
  Button,
  Card,
  Field,
  Inline,
  Select,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

const surveyReasons = [
  { value: 'nest', label: 'Nest check' },
  { value: 'migration', label: 'Migration count across the wetland reserve' },
  { value: 'tagging', label: 'Tagging' },
] as const;

export function SelectSection() {
  const [range, setRange] = useState('forest');
  const [compact, setCompact] = useState('savanna');
  const [carded, setCarded] = useState('forest');
  const [reason, setReason] = useState('nest');
  const [visit, setVisit] = useState('');
  const [visitError, setVisitError] = useState<string | undefined>();

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
/>

<Select
  label="Visit reason"
  placeholder="Choose a reason"
  required
  error={error}
  value={reason}
  onChange={setReason}
  options={reasons}
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
          label="Survey reason"
          onChange={setReason}
          options={surveyReasons}
          value={reason}
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
          The closed trigger matches Field: its text is centred and it ends in
          the Accordion chevron. It is as wide as its longest option, so it
          keeps its width when the value changes. The open list is glass, not
          the operating system menu. action is the last option and stays a
          command.
        </Text>
        <Card padding={4}>
          <Select
            label="Den range"
            onChange={setCarded}
            options={sampleHabitats}
            value={carded}
          />
        </Card>
        <Card padding={4}>
          <Field label="Den notes">
            <input name="den-notes" />
          </Field>
        </Card>
        <Text color="muted" variant="caption">
          A Select in a glass card opens over the card below it.
        </Text>
        <Card padding={4}>
          <Stack gap={3}>
            <Select
              error={visitError}
              label="Visit reason"
              onChange={(next) => {
                setVisit(next);
                setVisitError(undefined);
              }}
              options={surveyReasons}
              placeholder="Choose a reason"
              required
              value={visit}
            />
            <Inline gap={2}>
              <Button
                onPress={() =>
                  setVisitError(
                    visit ? undefined : 'Choose a reason for the visit.',
                  )
                }
                variant="secondary"
              >
                Log visit
              </Button>
            </Inline>
          </Stack>
        </Card>
        <Text color="muted" variant="caption">
          placeholder shows, muted, until a value is chosen and is not an
          option. required marks the label as Field does; error sits under the
          control and describes it, as Field's does.
        </Text>
      </Stack>
    </Section>
  );
}
