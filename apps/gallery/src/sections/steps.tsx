import {
  Button,
  Field,
  Stack,
  Step,
  Stepper,
  Steps,
  type StepStatus,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const stepCount = 3;

function statusOf(index: number, current: number): StepStatus {
  if (index < current) return 'done';
  return index === current ? 'current' : 'upcoming';
}

/** A survey form that opens its steps in order, as a guided form does. */
function SurveySteps() {
  const [current, setCurrent] = useState(0);
  const [site, setSite] = useState('North marsh');
  const [herons, setHerons] = useState<number | null>(12);
  const next = () => setCurrent((step) => Math.min(step + 1, stepCount));
  return (
    <Steps aria-label="Heron survey">
      <Step
        editLabel="Edit"
        onEdit={() => setCurrent(0)}
        status={statusOf(0, current)}
        summary={site}
        title="The site"
      >
        <Stack gap={3}>
          <Field label="Site">
            <input
              onChange={(event) => setSite(event.target.value)}
              value={site}
            />
          </Field>
          <Button onPress={next}>Continue</Button>
        </Stack>
      </Step>
      <Step
        editLabel="Edit"
        onEdit={() => setCurrent(1)}
        status={statusOf(1, current)}
        summary={`${herons ?? 0} herons`}
        title="The count"
      >
        <Stack gap={3}>
          <Stepper
            decrementLabel="One less"
            incrementLabel="One more"
            label="Herons"
            onChange={setHerons}
            placeholder="0"
            value={herons}
          />
          <Button onPress={next}>Continue</Button>
        </Stack>
      </Step>
      <Step status={statusOf(2, current)} title="Review">
        <Stack gap={3}>
          <Text>
            {site}: {herons ?? 0} herons.
          </Text>
          <Button onPress={next}>Save survey</Button>
        </Stack>
      </Step>
    </Steps>
  );
}

export function StepsSection() {
  return (
    <Section
      id="steps"
      purpose="Steps is a one-page vertical stepper: a form's Step panels in order, numbered by their place and joined by a line. The current step is open with its fields; a done step folds to one line with its summary and an Edit button named by its title; steps ahead are greyed; an error step stays open with a ! marker; a skipped step shows its reason. When a folded step opens, focus moves to its heading. Heading level and the status words assistive technology hears come from Steps (English by default)."
      title="Steps"
      usage={`<Steps aria-label="Heron survey">
  <Step status="done" title="The site" summary="North marsh"
    editLabel="Edit" onEdit={() => setCurrent(0)} />
  <Step status="current" title="The count">{fields}</Step>
  <Step status="upcoming" title="Review" />
</Steps>`}
    >
      <Stack gap={5}>
        <SurveySteps />
        <Steps aria-label="Every status" headingLevel={3}>
          <Step
            editLabel="Edit"
            onEdit={() => undefined}
            status="done"
            summary="Wetland · a long summary that folds to one line with an ellipsis when it is wider than its panel"
            title="Done"
          />
          <Step
            status="error"
            title="Needs attention: a title long enough to wrap on a phone"
          >
            <Text color="danger" variant="caption">
              Count the nests before you continue.
            </Text>
          </Step>
          <Step skippedReason="· not needed" status="skipped" title="Skipped" />
          <Step status="upcoming" title="Upcoming" />
        </Steps>
      </Stack>
    </Section>
  );
}
