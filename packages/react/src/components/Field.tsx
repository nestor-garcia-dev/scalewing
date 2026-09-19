'use client';

import { type SpacingStep } from '@scalewing/tokens';
import { cloneElement, isValidElement, useId, type ReactNode } from 'react';

import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type FieldSize = 'xs' | 'md';

type FieldControlProps = {
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  id?: string;
  required?: boolean;
};

export type FieldProps = {
  children: ReactNode;
  gap?: SpacingStep;
  label: string;
  labelVisuallyHidden?: boolean;
  size?: FieldSize;
  description?: string;
  error?: string;
  required?: boolean;
};

export function Field({
  children,
  gap = 1,
  label,
  labelVisuallyHidden = false,
  size = 'md',
  description,
  error,
  required = false,
}: FieldProps) {
  const controlId = useId();
  const messageId = useId();
  const message = error || description;
  const needsControl = Boolean(message || required);
  const className = [
    'sw-field',
    size === 'xs' && 'sw-field-xs',
    error && 'sw-field-invalid',
  ]
    .filter(Boolean)
    .join(' ');
  const labelText = (
    <Text
      as="span"
      className={labelVisuallyHidden ? 'sw-sr-only' : undefined}
      variant={size === 'xs' ? 'caption' : 'label'}
    >
      {label}
      {required ? (
        <span aria-hidden="true" className="sw-field-required">
          {' '}
          *
        </span>
      ) : null}
    </Text>
  );

  if (
    !isValidElement<FieldControlProps>(children) ||
    typeof children.type !== 'string' ||
    !['input', 'select', 'textarea'].includes(children.type)
  ) {
    if (needsControl)
      throw new TypeError(
        'Field validation requires one native input, select, or textarea child',
      );
    return (
      <Stack
        as="label"
        className={className}
        gap={labelVisuallyHidden ? 0 : gap}
      >
        {labelText}
        {children}
      </Stack>
    );
  }

  const describedBy = [
    children.props['aria-describedby'],
    message ? messageId : null,
  ]
    .filter(Boolean)
    .join(' ');
  const control = cloneElement(children, {
    id: children.props.id || controlId,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': error ? true : children.props['aria-invalid'],
    required: required || children.props.required,
  });

  return (
    <Stack as="div" className={className} gap={labelVisuallyHidden ? 0 : gap}>
      <label htmlFor={children.props.id || controlId}>{labelText}</label>
      {control}
      {message ? (
        <span
          className={error ? 'sw-field-error' : 'sw-field-description'}
          id={messageId}
          role={error ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </Stack>
  );
}
