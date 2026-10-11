import { type ReactNode } from 'react';

import { type InlineAlign } from '../../anchored-position.js';

/** One choice in a MultiSelect. */
export type MultiSelectOption = {
  value: string;
  label: string;
  /** A consumer mark before the label, such as a `GlyphTile`; hidden from assistive technology. */
  icon?: ReactNode;
  /** Draws a hairline before this option, to set a group of options apart. */
  separatorBefore?: boolean;
};

export type MultiSelectAlign = InlineAlign;

export type MultiSelectProps = {
  /**
   * What is chosen, such as "Show": the muted lead of the trigger and the
   * name of the panel of checkboxes.
   */
  label: string;
  options: readonly MultiSelectOption[];
  /** The checked values; `onChange` reports them in the options' order. */
  value: readonly string[];
  onChange: (value: string[]) => void;
  /** The command that checks every option, such as "All". */
  allLabel: string;
  /** The command that clears every option, such as "Clear". */
  clearLabel: string;
  /**
   * The trigger's words after the label, naming what is chosen, such as
   * "All entries" or "2 services". The consumer writes it.
   */
  summary: string;
  disabled?: boolean;
  /** The trigger edge the panel lines up with (default start). */
  align?: MultiSelectAlign;
};
