'use client';

import { type SpacingStep } from '@scalewing/tokens';
import { cloneElement, isValidElement, useId, type ReactNode } from 'react';

import {
  type AdornedControlAria,
  adornedControlAria,
  FieldAdornment,
} from './FieldAdornment.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type FieldSize = 'xs' | 'md';

type FieldControlProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-labelledby'?: string;
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
  /** Short text inside the control frame before the value, such as a currency sign. Not part of the value. */
  prefix?: string;
  /** Short text inside the control frame after the value, such as a unit. Not part of the value. */
  suffix?: string;
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
  prefix,
  suffix,
}: FieldProps) {
  const controlId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const labelId = useId();
  const prefixId = useId();
  const suffixId = useId();
  const message = error || description;
  const adorned = Boolean(prefix || suffix);
  const needsControl = Boolean(message || required || adorned);
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
        'Field validation and adornments require one native input, select, or textarea child',
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

  if (adorned && children.type !== 'input')
    throw new TypeError('Field prefix and suffix require a native input child');

  const adornment: AdornedControlAria = adorned
    ? adornedControlAria(
        children.props,
        labelId,
        prefix ? prefixId : undefined,
        suffix ? suffixId : undefined,
      )
    : { labelledBy: children.props['aria-labelledby'] };
  const describedBy = [
    children.props['aria-describedby'],
    adornment.describedBy,
    description && !error ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');
  const control = cloneElement(children, {
    id: children.props.id || controlId,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': error ? true : children.props['aria-invalid'],
    'aria-labelledby': adornment.labelledBy,
    required: required || children.props.required,
  });

  return (
    <Stack as="div" className={className} gap={labelVisuallyHidden ? 0 : gap}>
      <label htmlFor={children.props.id || controlId} id={labelId}>
        {labelText}
      </label>
      {adorned ? (
        <FieldAdornment
          prefix={prefix}
          prefixId={prefixId}
          suffix={suffix}
          suffixId={suffixId}
        >
          {control}
        </FieldAdornment>
      ) : (
        control
      )}
      {/* The error replaces the hint on screen; it is a polite live region,
          not an alert, so a submit that finds several errors does not fire
          several alerts at once. */}
      {description && !error ? (
        <span className="sw-field-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      <FieldErrorRegion
        className="sw-field-error"
        id={errorId}
        message={error}
      />
    </Stack>
  );
}
