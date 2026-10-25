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

/** A time with a unit that says why a long one is wrong. */
function NestTime() {
  const [value, setValue] = useState<number | null>(50);
  return (
    <Stepper
      {...buttonNames}
      error={
        value !== null && value > 40 ? 'Eggs cool after 40 min.' : undefined
      }
      label="Time off the nest"
      onChange={setValue}
      unit="min"
      value={value}
    />
  );
}

/** A count saved as you go: one save per finished entry, never per digit. */
function SavedCount() {
  const [value, setValue] = useState<number | null>(30);
  const [saves, setSaves] = useState<(number | null)[]>([]);
  const last = saves.at(-1);
  const lastWords =
    last === null || last === undefined ? 'empty' : `${last} min`;
  const status =
    saves.length === 0
      ? 'Nothing saved yet'
      : `Saved ${saves.length} ${saves.length === 1 ? 'time' : 'times'}, last ${lastWords}`;
  return (
    <Stack gap={2}>
      <Stepper
        {...buttonNames}
        label="Feeding time, saved as you go"
        max={90}
        min={10}
        onChange={setValue}
        onCommit={(next) => setSaves((done) => [...done, next])}
        unit="min"
        value={value}
      />
      <Text color="muted" role="status" variant="caption">
        {status}
      </Text>
    </Stack>
  );
}

export function StepperSection() {
  return (
    <Section
      id="stepper"
      purpose={
        'Stepper is a whole-number count changed with − and + or typed: one tab stop (a spin button that ArrowUp and ArrowDown step), with the buttons as pointer targets beside it. − stops at min and + at max; an empty box counts as min. Typed counts are reported as typed, even past max, so the page can say why in error; the box refuses anything but digits. The count is a few digits wide, or fills a table cell with width="full". limitAppearance="plain" keeps − at min and + at max in their usual look instead of faded; they stay disabled. unit is a short muted word after the count inside its frame ("90 min"), read with the count unless valueText says it. onCommit gives the finished count once per entry, for a page that saves as you go: on blur, on Enter, and 600 ms (commitDelay) after the last − / + press or step key, never per typed digit and never for an unchanged count.'
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
/>

<Stepper
  label="Feeding time"
  value={minutes}
  onChange={setMinutes}
  onCommit={save}
  min={10}
  max={90}
  unit="min"
  decrementLabel="One less"
  incrementLabel="One more"
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
          <Count
            initial={null}
            label="Ibises, − kept plain at 0"
            limitAppearance="plain"
            placeholder="0"
          />
        </Inline>
        <Inline align="start" gap={5} wrap>
          <Count
            initial={90}
            label="Flight time"
            max={240}
            step={5}
            unit="min"
          />
          <Count
            initial={null}
            label="Chicks"
            max={12}
            placeholder="0"
            unit="chicks"
          />
          <Count changed initial={45} label="Dive time, suggested" unit="min" />
          <Count disabled initial={6} label="Roost, locked" unit="hours" />
          <NestTime />
        </Inline>
        <SavedCount />
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
          <Count
            initial={30}
            label="Spoonbill feeding time"
            labelVisuallyHidden
            unit="min"
            width="full"
          />
        </Stack>
      </Stack>
    </Section>
  );
}
