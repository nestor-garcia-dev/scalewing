import { type SpacingStep } from '@scalewing/tokens';
import { type ReactNode } from 'react';

import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type FieldProps = {
  children: ReactNode;
  gap?: SpacingStep;
  label: string;
};

export function Field({ children, gap = 1, label }: FieldProps) {
  return (
    <Stack as="label" gap={gap}>
      <Text as="span" variant="label">
        {label}
      </Text>
      {children}
    </Stack>
  );
}
