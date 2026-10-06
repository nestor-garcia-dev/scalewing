import { type ReactNode } from 'react';

import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type LabeledControlProps = {
  children: ReactNode;
  error?: string;
  hint?: string;
  /** Skips drawing the label; the control still takes it as its name. */
  hideLabel?: boolean;
  label: string;
};

/** Label above, control in the middle, hint or error caption below. */
export function LabeledControl({
  children,
  error,
  hideLabel = false,
  hint,
  label,
}: LabeledControlProps) {
  const supportingText = error ?? hint;

  return (
    <Stack gap={1}>
      {hideLabel ? null : <Text variant="label">{label}</Text>}
      {children}
      {supportingText ? (
        <Text
          accessibilityLiveRegion={error ? 'polite' : 'none'}
          color={error ? 'danger' : 'muted'}
          variant="caption"
        >
          {supportingText}
        </Text>
      ) : null}
    </Stack>
  );
}
