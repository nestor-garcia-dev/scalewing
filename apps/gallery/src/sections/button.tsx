import { Button, Inline, Stack, Text } from '@scalewing/react';
import {
  buttonSizes,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from '@scalewing/tokens';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

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

  return (
    <Section
      id="button"
      purpose="Button is a real button element. Use it for press actions. Primary, secondary, and tertiary are the three action tiers; secondary is outlined until a palette fills it (switch to signal to see all three filled). Ghost is text only; danger is destructive. Disabled blocks onPress. Default type is button; forms may pass submit."
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
        <Inline gap={2} wrap>
          <Button
            aria-pressed={false}
            onPress={() => setLastPress('ghost xs unselected')}
            size="xs"
            variant="ghost"
          >
            Quiet
          </Button>
          <Button
            aria-pressed
            onPress={() => setLastPress('secondary xs selected')}
            size="xs"
            variant="secondary"
          >
            Selected
          </Button>
        </Inline>
        <Text variant="caption">Last press: {lastPress}</Text>
      </Stack>
    </Section>
  );
}
