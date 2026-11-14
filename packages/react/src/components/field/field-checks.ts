import { isValidElement, type KeyboardEvent } from 'react';

import { assertFieldWidth } from '../../css/css-field-width.js';
import { assertFieldDescriptionTone } from './FieldDescription.js';
import type { FieldProps } from './field-props.js';

export const fieldVariants = ['outlined', 'search', 'read-only'] as const;
export type FieldVariant = (typeof fieldVariants)[number];

/** The props Field reads from, and sets on, its native control child. */
export type FieldControlProps = {
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

/** A read-only field draws one native input or textarea that is `readOnly`. */
function assertReadOnlyChild(child: unknown): void {
  if (
    !isValidElement<FieldControlProps>(child) ||
    (child.type !== 'input' && child.type !== 'textarea') ||
    child.props.readOnly !== true
  )
    throw new TypeError(
      'A read-only Field needs one native input or textarea child with readOnly',
    );
}

/**
 * Fails closed on a Field it cannot draw: an unknown variant, width or
 * description tone, search props on an outlined field, and a search field
 * without its clear button, its handler or one controlled native input.
 */
export function assertFieldProps(props: FieldProps, child: unknown): void {
  const { variant = 'outlined', descriptionTone = 'muted' } = props;
  assertFieldWidth(props.width);
  assertFieldDescriptionTone(descriptionTone);
  if (!fieldVariants.includes(variant))
    throw new RangeError(`Unknown Field variant: ${String(variant)}`);
  if (variant === 'read-only') {
    assertReadOnlyChild(child);
    if (props.prefix || props.suffix)
      throw new TypeError('A read-only Field takes no prefix or suffix');
    // A value the person cannot change cannot be invalid or changed here.
    if (
      props.error !== undefined ||
      props.invalid !== undefined ||
      props.changed !== undefined
    )
      throw new TypeError(
        'A read-only Field takes no error, invalid or changed',
      );
  }
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
export function passesInvalid(props: FieldProps): boolean {
  return props.invalid !== undefined || props.changed !== undefined;
}
