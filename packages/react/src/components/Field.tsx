import { type SpacingStep } from '@scalewing/tokens';
import { type ReactNode } from 'react';

import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type FieldSize = 'xs' | 'md';

export type FieldProps = {
  children: ReactNode;
  gap?: SpacingStep;
  label: string;
  labelVisuallyHidden?: boolean;
  size?: FieldSize;
};

export function Field({
  children,
  gap = 1,
  label,
  labelVisuallyHidden = false,
  size = 'md',
}: FieldProps) {
  return (
    <Stack
      as="label"
      className={size === 'xs' ? 'sw-field-xs' : undefined}
      gap={labelVisuallyHidden ? 0 : gap}
    >
      <Text
        as="span"
        className={labelVisuallyHidden ? 'sw-sr-only' : undefined}
        variant={size === 'xs' ? 'caption' : 'label'}
      >
        {label}
      </Text>
      {children}
    </Stack>
  );
}
