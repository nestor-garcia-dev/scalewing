import { type SpacingStep } from '@scalewing/tokens';
import { type ReactNode } from 'react';

import { type FieldWidth } from '../../css/css-field-width.js';
import { type RequiredMark } from '../FieldLabelText.js';
import { type FieldDescriptionTone } from './FieldDescription.js';
import { type FieldVariant } from './field-checks.js';

export type FieldSize = 'xs' | 'md';

export type FieldProps = {
  children: ReactNode;
  gap?: SpacingStep;
  label: string;
  labelVisuallyHidden?: boolean;
  size?: FieldSize;
  description?: string;
  /**
   * `warning` draws `description` in the warning colour after a small alert
   * glyph, for a hint that needs the person but is not an error, such as a
   * value another row already has. It stays the control's description and
   * sets no invalid state; `error` still replaces it. Default `muted`; an
   * unknown tone throws a `RangeError`.
   */
  descriptionTone?: FieldDescriptionTone;
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
  /**
   * `hidden` leaves out the label's " *" while the control stays required
   * (and announced so); `visible` (default) draws it.
   * When hidden, say in visible text which fields must be filled; a
   * placeholder alone is not enough.
   */
  requiredMark?: RequiredMark;
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
  /**
   * Caps the control's width at a Table column size (`xs` 4rem, `sm` 6rem,
   * `md` 8rem, `lg` 12rem, `xl` 16rem), at the start of the column and
   * never wider than it, so a short value such as a rate or a count does
   * not stretch across a form. The label and messages keep the column's
   * width. Left out, the control fills the column. It needs one native
   * text input, select or textarea child (a `TypeError` otherwise); an
   * unknown width throws a `RangeError`.
   */
  width?: FieldWidth;
};
