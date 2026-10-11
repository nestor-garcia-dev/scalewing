import { type BadgeTone } from '../../css/css-data.js';
import { type RequiredMark } from '../FieldLabelText.js';

/** A short tag after an option's label, such as "Warning" or "Blocked". */
export type ComboboxBadge = { label: string; tone?: BadgeTone };

/** One suggestion in a Combobox. */
export type ComboboxOption = {
  value: string;
  label: string;
  /** A muted line of detail after the label, such as "3 items · updated Sep 28". */
  description?: string;
  badge?: ComboboxBadge;
  /** Shown, read as unavailable, and never chosen, such as an archived item. */
  disabled?: boolean;
};

/** A run of suggestions under a heading, such as "All items". */
export type ComboboxGroup = {
  /** The group's heading; a group without one has no heading. */
  label?: string;
  options: readonly ComboboxOption[];
};

/** A command at the end of the list, such as "+ New entry “acme”". */
export type ComboboxAction = {
  label: string;
  onPress: () => void;
  badge?: ComboboxBadge;
};

export const comboboxSizes = ['md', 'xs'] as const;
export type ComboboxSize = (typeof comboboxSizes)[number];

export type ComboboxProps = {
  /** The input's name, drawn above it unless `labelVisuallyHidden`. */
  label: string;
  labelVisuallyHidden?: boolean;
  /** The text in the input; the consumer filters `groups` from it. */
  inputValue: string;
  onInputChange: (value: string) => void;
  groups: readonly ComboboxGroup[];
  /** Called with the chosen option's value; the consumer sets `inputValue`. */
  onSelect: (value: string) => void;
  action?: ComboboxAction;
  /**
   * Shown in the list, and announced, when no group has an option, such as
   * "Nothing matches".
   */
  emptyText: string;
  /**
   * The words announced for the number of options while the list is open,
   * such as `(n) => \`${n} items\``; without it only the empty text is
   * announced.
   */
  countText?: (count: number) => string;
  /** The list's name when it differs from the input's, such as "Results". */
  listLabel?: string;
  /** A muted line under the suggestions, such as how to find more. */
  note?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  required?: boolean;
  /**
   * `hidden` leaves out the label's " *" while the input stays required
   * (and announced so); `visible` (default) draws it.
   * When hidden, say in visible text which fields must be filled; a
   * placeholder alone is not enough.
   */
  requiredMark?: RequiredMark;
  disabled?: boolean;
  size?: ComboboxSize;
};
