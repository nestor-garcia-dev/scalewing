import { Button, Inline, Stack, Text } from '@scalewing/react';
import {
  buttonSizes,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from '@scalewing/tokens';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

function buttonName(
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean,
): string {
  const state = disabled ? 'disabled' : 'enabled';
  return `${variant} ${size} ${state}`;
}

export function ButtonSection() {
  const [lastPress, setLastPress] = useState('None yet');
  const [habitat, setHabitat] = useState<string>(sampleHabitats[0].value);
  const [shift, setShift] = useState<'Day' | 'Night'>('Day');

  return (
    <Section
      id="button"
      purpose="Button is a real button element. Use it for press actions. Primary, secondary, and tertiary are the three action tiers; secondary is outlined until a palette fills it (switch to signal to see all three filled). Ghost is text only; danger is destructive. Disabled blocks onPress. Default type is button; forms may pass submit. A toggle button passes aria-pressed: the pressed one gets an accent ring."
      title="Button"
      usage={`<Button variant="primary" size="md" onPress={() => undefined}>
  Save
</Button>`}
    >
      <Stack gap={4}>
        {buttonVariants.map((variant) => (
          <Stack gap={2} key={variant}>
            <Text variant="label">{variant}</Text>
            <Inline gap={2} wrap>
              {buttonSizes.map((size) => (
                <Button
                  key={`${variant}-${size}`}
                  onPress={() => setLastPress(buttonName(variant, size, false))}
                  size={size}
                  variant={variant}
                >
                  {buttonName(variant, size, false)}
                </Button>
              ))}
              {buttonSizes.map((size) => (
                <Button
                  disabled
                  key={`${variant}-${size}-disabled`}
                  onPress={() => setLastPress(buttonName(variant, size, true))}
                  size={size}
                  variant={variant}
                >
                  {buttonName(variant, size, true)}
                </Button>
              ))}
            </Inline>
          </Stack>
        ))}
        <Inline gap={2} wrap>
          <Button
            onPress={() => setLastPress('submit md enabled')}
            type="submit"
            variant="secondary"
          >
            submit md enabled
          </Button>
          <Button
            onPress={() => setLastPress('reset md enabled')}
            type="reset"
            variant="ghost"
          >
            reset md enabled
          </Button>
        </Inline>
        <Stack gap={2}>
          <Text variant="label">Toggle buttons</Text>
          <Inline aria-label="Preferred habitat" gap={2} role="group" wrap>
            {sampleHabitats.map((option) => (
              <Button
                aria-pressed={option.value === habitat}
                key={option.value}
                onPress={() => {
                  setHabitat(option.value);
                  setLastPress(`habitat ${option.value}`);
                }}
                size="sm"
                variant="secondary"
              >
                {option.label}
              </Button>
            ))}
          </Inline>
          <Inline aria-label="Survey shift" gap={2} role="group" wrap>
            {(['Day', 'Night'] as const).map((shiftLabel) => (
              <Button
                aria-pressed={shiftLabel === shift}
                key={shiftLabel}
                onPress={() => setShift(shiftLabel)}
                size="sm"
                variant={shiftLabel === shift ? 'primary' : 'secondary'}
              >
                {shiftLabel}
              </Button>
            ))}
          </Inline>
          <Text color="muted" variant="caption">
            aria-pressed draws the pressed button with an accent ring outside
            its fill, past a gap, whatever its variant; a focused pressed button
            moves its focus outline out past the ring. An unpressed button keeps
            its full contrast; pair primary and secondary, as in Survey shift,
            to make the choice stand out further.
          </Text>
        </Stack>
        <Text variant="caption">Last press: {lastPress}</Text>
      </Stack>
    </Section>
  );
}
