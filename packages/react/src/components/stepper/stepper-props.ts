/** `fixed` sizes the count for a few digits; `full` fills its container, such as a table cell. */
export type StepperWidth = 'fixed' | 'full';

export const stepperLimitAppearances = ['faded', 'plain'] as const;

/**
 * How − looks at `min` and + at `max`, where a press cannot move the count:
 * `faded` (the default) fades the button as any disabled control; `plain`
 * keeps its usual look. Either way the button is disabled.
 */
export type StepperLimitAppearance = (typeof stepperLimitAppearances)[number];

export type StepperProps = {
  /** Names the count. Keep it visible unless headers around it say it (`labelVisuallyHidden`). */
  label: string;
  labelVisuallyHidden?: boolean;
  /** The count, or `null` for an empty box (none). */
  value: number | null;
  /** A whole count, or `null` when the box is emptied. Typed counts are reported as typed, even outside the bounds. */
  onChange: (value: number | null) => void;
  /**
   * The finished count, once per entry, for a page that saves as you go:
   * on blur, on Enter, and `commitDelay` ms after the last − / + press or
   * step key (ArrowUp, ArrowDown, Home, End). Never per typed digit, and
   * never when the count is the one last committed (or held before the
   * first edit). It gives the count you hold then, `null` or outside the
   * bounds included, as `onChange` reports typed counts. `onChange` is
   * unchanged.
   */
  onCommit?: (value: number | null) => void;
  /** How long − / + presses and step keys settle before `onCommit`, in ms; defaults to 600. */
  commitDelay?: number;
  /** The lowest count − reaches; defaults to 0. */
  min?: number;
  /** The highest count + reaches; no upper bound when left out. */
  max?: number;
  /** How much one press, or one arrow key, moves the count; defaults to 1. */
  step?: number;
  /** The − button's name, such as "One less". */
  decrementLabel: string;
  /** The + button's name, such as "One more". */
  incrementLabel: string;
  /**
   * A message under the control, as `Field`'s: a polite live region linked by
   * `aria-describedby`, with `aria-invalid` and the danger border. An empty
   * string is no error.
   */
  error?: string;
  /** `Field`'s changed look (the accent border and tint) for a count someone changed, or a suggestion. `error` wins. */
  changed?: boolean;
  disabled?: boolean;
  /** Readable and focusable, never changed: the buttons are hidden and keep their room. */
  readOnly?: boolean;
  /**
   * Says the count in words for assistive technology (`aria-valuetext`),
   * such as "12 straps". It wins over the count and `unit` read together.
   */
  valueText?: string;
  /**
   * A short muted word after the count, inside its frame, such as "min".
   * Without `valueText` the count is read with it ("90 min"), word for
   * word: a unit that changes with the count ("players") reads "1 players",
   * so pass `valueText` with the right form ("1 player"). Not blank.
   */
  unit?: string;
  /**
   * Ids of elements that describe the count, such as the value it adds up
   * to; read before an `error`'s message.
   */
  'aria-describedby'?: string;
  /** Shown in an empty box, such as "0". */
  placeholder?: string;
  name?: string;
  width?: StepperWidth;
  /**
   * `plain` keeps − at `min` and + at `max` in their usual look instead of
   * fading them (`faded`, the default). The button is still disabled, and a
   * disabled or read-only Stepper is unchanged.
   */
  limitAppearance?: StepperLimitAppearance;
};
