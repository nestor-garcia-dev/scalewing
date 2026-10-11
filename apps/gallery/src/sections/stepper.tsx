import {
  Inline,
  Stack,
  Stepper,
  type StepperProps,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const buttonNames = { decrementLabel: 'One less', incrementLabel: 'One more' };

/** A count the gallery holds, as a consumer would. */
function Count({
  initial,
  ...props
}: Omit<
  StepperProps,
  'value' | 'onChange' | 'decrementLabel' | 'incrementLabel'
> & {
  initial: number | null;
}) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <Stepper {...buttonNames} {...props} onChange={setValue} value={value} />
  );
}

/** A nest count that says why a count past the nests is wrong. */
function NestCount() {
  const [value, setValue] = useState<number | null>(13);
  const nests = 12;
  return (
    <Stepper
      {...buttonNames}
      error={
        value !== null && value > nests
          ? `Only ${nests} nests on the island.`
          : undefined
      }
      label="Nests with eggs"
      onChange={setValue}
      value={value}
    />
  );
}

export function StepperSection() {
  return (
    <Section
      id="stepper"
      purpose={
        'Stepper is a whole-number count changed with − and + or typed: one tab stop (a spin button that ArrowUp and ArrowDown step), with the buttons as pointer targets beside it. − stops at min and + at max; an empty box counts as min. Typed counts are reported as typed, even past max, so the page can say why in error; the box refuses anything but digits. The count is a few digits wide, or fills a table cell with width="full".'
      }
      title="Stepper"
      usage={`<Stepper
  label="Herons"
  value={count}
  onChange={setCount}
  max={40}
  decrementLabel="One less"
  incrementLabel="One more"
  placeholder="0"
/>`}
    >
      <Stack gap={5}>
        <Inline align="start" gap={5} wrap>
          <Count initial={null} label="Herons" max={40} placeholder="0" />
          <Count initial={5} label="Egrets" max={5} />
          <Count initial={20} label="Flamingos, in fives" max={200} step={5} />
          <Count initial={2} label="Eggs counted in the far reed beds" />
        </Inline>
        <Inline align="start" gap={5} wrap>
          <NestCount />
          <Count changed initial={8} label="Storks, suggested" />
          <Count disabled initial={3} label="Cranes" />
          <Count initial={11} label="Pelicans, counted" readOnly />
        </Inline>
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            {'width="full" with a hidden label, as in a table cell'}
          </Text>
          <Count
            initial={2}
            label="Spoonbills"
            labelVisuallyHidden
            placeholder="0"
            width="full"
          />
        </Stack>
      </Stack>
    </Section>
  );
}
