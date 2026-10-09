import { Field, Inline, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { sampleHabitats } from '../sample-copy.js';

const saved = { adults: '25', weight: '480.00', habitat: 'forest' } as const;

function habitatLabel(value: string): string {
  return sampleHabitats.find((habitat) => habitat.value === value)?.label ?? '';
}

/**
 * A correction of a saved survey: each value changed from the saved one is
 * marked (the accent border and a tinted fill, which focus never draws) and
 * says what it was, and the line under the fields counts them.
 */
export function SurveyCorrection() {
  const [adults, setAdults] = useState<string>(saved.adults);
  const [weight, setWeight] = useState<string>(saved.weight);
  const [habitat, setHabitat] = useState<string>(saved.habitat);
  const changed = [
    adults !== saved.adults,
    weight !== saved.weight,
    habitat !== saved.habitat,
  ].filter(Boolean).length;
  return (
    <Stack gap={2}>
      <Inline align="start" gap={3} wrap>
        <Field
          changed={adults !== saved.adults}
          description={
            adults !== saved.adults ? `Was ${saved.adults}` : undefined
          }
          label="Adult herons"
        >
          <input
            inputMode="numeric"
            name="adults"
            onChange={(event) => setAdults(event.currentTarget.value)}
            value={adults}
          />
        </Field>
        <Field
          changed={weight !== saved.weight}
          description={
            weight !== saved.weight ? `Was ${saved.weight} g` : undefined
          }
          label="Feed weight"
          suffix="g"
        >
          <input
            inputMode="decimal"
            name="weight"
            onChange={(event) => setWeight(event.currentTarget.value)}
            value={weight}
          />
        </Field>
        <Field
          changed={habitat !== saved.habitat}
          description={
            habitat !== saved.habitat
              ? `Was ${habitatLabel(saved.habitat)}`
              : undefined
          }
          label="Colony habitat"
        >
          <select
            name="colony-habitat"
            onChange={(event) => setHabitat(event.currentTarget.value)}
            value={habitat}
          >
            {sampleHabitats.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </Inline>
      <Text color="muted" variant="caption">
        {changed === 0
          ? 'No value changed.'
          : `${changed} ${changed === 1 ? 'value' : 'values'} changed · not saved yet`}
      </Text>
    </Stack>
  );
}
