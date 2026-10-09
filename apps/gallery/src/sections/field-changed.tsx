import { Field, Inline, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

const saved = { adults: '25', weight: '480.00' } as const;

/**
 * A correction of a saved survey: each value changed from the saved one is
 * marked and says what it was, and the line under the fields counts them.
 */
export function SurveyCorrection() {
  const [adults, setAdults] = useState<string>(saved.adults);
  const [weight, setWeight] = useState<string>(saved.weight);
  const changed = [adults !== saved.adults, weight !== saved.weight].filter(
    Boolean,
  ).length;
  return (
    <Stack gap={2}>
      <Inline gap={3}>
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
      </Inline>
      <Text color="muted" variant="caption">
        {changed === 0
          ? 'No value changed.'
          : `${changed} ${changed === 1 ? 'value' : 'values'} changed · not saved yet`}
      </Text>
    </Stack>
  );
}
