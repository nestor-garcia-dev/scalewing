'use client';

import { cloneElement, isValidElement, useId, type KeyboardEvent } from 'react';

import {
  type AdornedControlAria,
  adornedControlAria,
  FieldAdornment,
} from './FieldAdornment.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { assertRequiredMark, FieldLabelText } from './FieldLabelText.js';
import { fieldWidthClass } from '../css/css-field-width.js';
import { FieldDescription } from './field/FieldDescription.js';
import { type FieldProps } from './field/field-props.js';
import { SearchFrame } from './field/SearchFrame.js';
import {
  assertFieldProps,
  type FieldControlProps,
  fieldVariants,
  type FieldVariant,
  passesInvalid,
} from './field/field-checks.js';
import { Stack } from './Stack.js';

export { fieldVariants, type FieldVariant };
export type { FieldProps, FieldSize } from './field/field-props.js';
export {
  fieldDescriptionTones,
  type FieldDescriptionTone,
} from './field/FieldDescription.js';

export function Field(props: FieldProps) {
  const {
    children,
    gap = 1,
    label,
    labelVisuallyHidden = false,
    size = 'md',
    description,
    descriptionTone = 'muted',
    error,
    invalid = false,
    changed = false,
    required = false,
    requiredMark = 'visible',
    prefix,
    suffix,
    variant = 'outlined',
    leading,
    clearLabel = '',
    onClear,
    width,
  } = props;
  assertFieldProps(props, children);
  const search = variant === 'search';
  const controlId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const labelId = useId();
  const prefixId = useId();
  const suffixId = useId();
  assertRequiredMark(requiredMark);
  const message = error || description;
  const marksInvalid = Boolean(error) || invalid;
  const adorned = Boolean(prefix || suffix);
  const needsControl = Boolean(
    message ||
    marksInvalid ||
    passesInvalid(props) ||
    required ||
    adorned ||
    Boolean(width),
  );
  const className = [
    'sw-field',
    size === 'xs' && 'sw-field-xs',
    marksInvalid && 'sw-field-invalid',
    search && 'sw-field-search-field',
    changed && !marksInvalid && 'sw-field-changed',
    width && 'sw-field-sized',
    width && fieldWidthClass(width),
  ]
    .filter(Boolean)
    .join(' ');
  // A search field hides its whole label element instead (see below).
  const labelHidden = labelVisuallyHidden && !search;
  const labelText = (
    <FieldLabelText
      label={label}
      required={required}
      requiredMark={requiredMark}
      size={size}
      visuallyHidden={labelHidden}
    />
  );

  if (
    !isValidElement<FieldControlProps>(children) ||
    typeof children.type !== 'string' ||
    !['input', 'select', 'textarea'].includes(children.type)
  ) {
    if (needsControl)
      throw new TypeError(
        'Field validation, adornments and width require one native input, select, or textarea child',
      );
    return (
      <Stack as="label" className={className} gap={labelHidden ? 0 : gap}>
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
    ...(search
      ? {
          type: 'search',
          enterKeyHint: children.props.enterKeyHint ?? 'search',
          // Escape empties the box through onClear, the one clearing path
          // (WebKit and Blink would otherwise clear it themselves).
          onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
            children.props.onKeyDown?.(event);
            if (
              event.key === 'Escape' &&
              !event.defaultPrevented &&
              !event.currentTarget.readOnly &&
              event.currentTarget.value !== ''
            ) {
              event.preventDefault();
              onClear?.();
            }
          },
        }
      : {}),
  });
  const value = children.props.value;
  const hasText = value !== undefined && value !== null && String(value) !== '';

  return (
    <Stack as="div" className={className} gap={labelHidden ? 0 : gap}>
      {/* A search field's label is out of the flow, so the gap still sets
          a description or an error off the frame. */}
      <label
        className={search ? 'sw-sr-only' : undefined}
        htmlFor={children.props.id || controlId}
        id={labelId}
      >
        {labelText}
      </label>
      {search ? (
        <SearchFrame
          clearLabel={clearLabel}
          leading={leading}
          onClear={onClear!}
          showClear={
            hasText && !children.props.disabled && !children.props.readOnly
          }
        >
          {control}
        </SearchFrame>
      ) : adorned ? (
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
        <FieldDescription id={descriptionId} tone={descriptionTone}>
          {description}
        </FieldDescription>
      ) : null}
      <FieldErrorRegion
        className="sw-field-error"
        id={errorId}
        message={error}
      />
    </Stack>
  );
}
