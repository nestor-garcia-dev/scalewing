'use client';

import { type SpacingStep } from '@scalewing/tokens';
import {
  cloneElement,
  isValidElement,
  useId,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import {
  type AdornedControlAria,
  adornedControlAria,
  FieldAdornment,
} from './FieldAdornment.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { FieldLabelText } from './FieldLabelText.js';
import { SearchFrame } from './field/SearchFrame.js';
import { Stack } from './Stack.js';

export type FieldSize = 'xs' | 'md';

export const fieldVariants = ['outlined', 'search'] as const;
export type FieldVariant = (typeof fieldVariants)[number];

type FieldControlProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-labelledby'?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
  value?: unknown;
  enterKeyHint?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
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
   * `invalid`, even `false` but not `undefined`, requires one native control
   * child from the first render.
   */
  invalid?: boolean;
  /**
   * Marks a value the person changed from a saved one, such as a field in a
   * correction: the control's border (or an adorned frame's) in the accent
   * color, thicker than the plain hairline, and its fill tinted with 12 % of
   * the accent, so a changed field reads apart from the focused one (focus
   * draws a ring and never tints). The value keeps 4.5:1 on the tint; while
   * a placeholder shows, the fill stays plain. It is a cue, not the record:
   * say what it was in `description` ("Was 25"). `invalid` and `error`
   * win. Like `invalid`, passing it, even `false` but not `undefined`,
   * requires one native control child from the first render.
   */
  changed?: boolean;
  required?: boolean;
  /** Short text inside the control frame before the value, such as a currency sign. Not part of the value. */
  prefix?: string;
  /** Short text inside the control frame after the value, such as a unit. Not part of the value. */
  suffix?: string;
  /**
   * `outlined` (default) is the labelled form field. `search` is a search
   * box: the label is not drawn (it stays the input's name), a `leading`
   * glyph sits at the frame's start, the input is `type="search"`, and a
   * clear button named `clearLabel` shows while the input holds text and
   * is enabled; it calls `onClear` (set the value to `''`) and puts focus
   * back in the input. Needs one native `input` child with a `value`.
   */
  variant?: FieldVariant;
  /** A search field's glyph at its start, such as a magnifier; hidden from assistive technology. */
  leading?: ReactNode;
  /** A search field's clear button name, such as "Clear search". */
  clearLabel?: string;
  /** Called by a search field's clear button; the consumer empties the value. */
  onClear?: () => void;
};

function assertSearch(props: FieldProps, child: unknown): void {
  const { variant = 'outlined' } = props;
  if (!fieldVariants.includes(variant))
    throw new RangeError(`Unknown Field variant: ${String(variant)}`);
  if (variant !== 'search') {
    if (
      props.leading !== undefined ||
      props.clearLabel !== undefined ||
      props.onClear !== undefined
    )
      throw new TypeError(
        'Field leading, clearLabel and onClear are for variant="search"',
      );
    return;
  }
  if (!props.clearLabel?.trim())
    throw new RangeError('A search Field needs a nonempty clearLabel');
  if (typeof props.onClear !== 'function')
    throw new TypeError('A search Field needs onClear');
  if (props.prefix || props.suffix)
    throw new TypeError('A search Field takes leading, not prefix or suffix');
  if (!isValidElement<FieldControlProps>(child) || child.type !== 'input')
    throw new TypeError('A search Field needs one native input child');
  if (child.props.value === undefined)
    throw new TypeError(
      'A search Field needs a controlled input: pass value (and onChange)',
    );
}

/**
 * `invalid` was passed, even as `false`, but not as `undefined` (a wrapper
 * forwarding an optional prop passes nothing): such a field needs one native
 * control from its first render, so a form learns it on the happy path
 * instead of on its first failed submit. `error` keeps its older rule (it
 * requires the control only while it holds a message), so a composed
 * child beside `error={undefined}` still renders.
 */
function passesInvalid(props: FieldProps): boolean {
  return props.invalid !== undefined || props.changed !== undefined;
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
    changed = false,
    required = false,
    prefix,
    suffix,
    variant = 'outlined',
    leading,
    clearLabel = '',
    onClear,
  } = props;
  assertSearch(props, children);
  const search = variant === 'search';
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
    search && 'sw-field-search-field',
    changed && !marksInvalid && 'sw-field-changed',
  ]
    .filter(Boolean)
    .join(' ');
  // A search field hides its whole label element instead (see below).
  const labelHidden = labelVisuallyHidden && !search;
  const labelText = (
    <FieldLabelText
      label={label}
      required={required}
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
        'Field validation and adornments require one native input, select, or textarea child',
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
