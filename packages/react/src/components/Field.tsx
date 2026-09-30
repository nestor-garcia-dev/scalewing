'use client';

import { type SpacingStep } from '@scalewing/tokens';
import { cloneElement, isValidElement, useId, type ReactNode } from 'react';

import {
  type AdornedControlAria,
  adornedControlAria,
  FieldAdornment,
} from './FieldAdornment.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { FieldLabelText } from './FieldLabelText.js';
import { Stack } from './Stack.js';

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
  /**
   * Marks the control invalid (`aria-invalid` and the danger border) without
   * a message of its own, for a field whose error is shown elsewhere, such
   * as one message under a group of fields. Point the control's
   * `aria-describedby` at that message. `error` implies it. Passing
   * `invalid` at all, even `false`, requires one native control child from
   * the first render.
   */
  invalid?: boolean;
  required?: boolean;
  /** Short text inside the control frame before the value, such as a currency sign. Not part of the value. */
  prefix?: string;
  /** Short text inside the control frame after the value, such as a unit. Not part of the value. */
  suffix?: string;
};

/**
 * `invalid` was passed, even as `false`: such a field needs one native
 * control from its first render, so a form learns it on the happy path
 * instead of on its first failed submit. `error` keeps its older rule (it
 * requires the control only while it holds a message), so a composed
 * child beside `error={undefined}` still renders.
 */
function passesInvalid(props: FieldProps): boolean {
  return 'invalid' in props;
}

export function Field(props: FieldProps) {
  const {
    children,
    gap = 1,
    label,
    labelVisuallyHidden = false,
    size = 'md',
    description,
    error,
    invalid = false,
    required = false,
    prefix,
    suffix,
  } = props;
  const controlId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const labelId = useId();
  const prefixId = useId();
  const suffixId = useId();
  const message = error || description;
  const marksInvalid = Boolean(error) || invalid;
  const adorned = Boolean(prefix || suffix);
  const needsControl = Boolean(
    message || marksInvalid || passesInvalid(props) || required || adorned,
  );
  const className = [
    'sw-field',
    size === 'xs' && 'sw-field-xs',
    marksInvalid && 'sw-field-invalid',
  ]
    .filter(Boolean)
    .join(' ');
  const labelText = (
    <FieldLabelText
      label={label}
      required={required}
      size={size}
      visuallyHidden={labelVisuallyHidden}
    />
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
    'aria-invalid': marksInvalid ? true : children.props['aria-invalid'],
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
