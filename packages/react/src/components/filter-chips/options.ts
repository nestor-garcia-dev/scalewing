import { type RequiredMark } from '../FieldLabelText.js';

export type FilterChipOption = {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

/**
 * How a chip's count is drawn: `figure` (the default), a muted tabular
 * figure after a space; `inline`, the label's own words and type, after a
 * middle dot ("Open · 3"), the dot hidden from assistive technology.
 */
export const filterChipCountAppearances = ['figure', 'inline'] as const;
export type FilterChipCountAppearance =
  (typeof filterChipCountAppearances)[number];

/**
 * What the chips do when they do not fit their row: `wrap` (the default)
 * onto more rows, or `scroll` sideways on one row.
 */
export const filterChipsOverflows = ['wrap', 'scroll'] as const;
export type FilterChipsOverflow = (typeof filterChipsOverflows)[number];

/** One chosen chip, a radio in a group. */
type SingleChoice = {
  multiple?: false;
  /** The chosen option's value, or `''` while nothing is chosen yet. */
  value: string;
  onChange: (value: string) => void;
  /**
   * A choice must be made, such as a reason: each radio is `required` and
   * the label shows the required mark (hidden from assistive technology,
   * which reads the radios' own state).
   */
  required?: boolean;
};

/**
 * Several chips on at once, each a checkbox, such as the days of a week.
 * Nothing makes a checkbox group required, so `required` is refused: say
 * what is needed in `error`.
 */
type MultipleChoice = {
  multiple: true;
  /** The chosen options' values, in any order; empty for none. */
  value: readonly string[];
  /** Every chosen value, in the options' order. */
  onChange: (values: string[]) => void;
  required?: false;
};

type FilterChipsChoice = SingleChoice | MultipleChoice;

export type FilterChipsProps = FilterChipsChoice & {
  label: string;
  options: readonly FilterChipOption[];
  /**
   * Keeps the label as the group's name but does not draw it, for chips
   * whose meaning their words and place already show.
   */
  labelVisuallyHidden?: boolean;
  /**
   * `hidden` leaves out the label's " *" while the control stays required
   * (and announced so); `visible` (default) draws it.
   * When hidden, say in visible text which fields must be filled; a
   * placeholder alone is not enough.
   */
  requiredMark?: RequiredMark;
  countAppearance?: FilterChipCountAppearance;
  overflow?: FilterChipsOverflow;
  /**
   * A message under the chips, such as "Pick a reason": a polite live
   * region linked to the group by `aria-describedby`; the group is marked
   * invalid and every chip takes the danger edge. An empty string is no
   * error.
   */
  error?: string;
  /** More ids that describe the group, such as a hint beside it. */
  'aria-describedby'?: string;
};
