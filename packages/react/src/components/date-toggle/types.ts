import { type WeekStart } from '../../calendar-month.js';

export type DateToggleCalendarProps = {
  /** The group's name ("Days off"). */
  label: string;
  /** The first day that can be toggled (YYYY-MM-DD); the first month shown is its month. */
  min: string;
  /** The last day that can be toggled (YYYY-MM-DD); the last month shown is its month. */
  max: string;
  /** The days toggled on (YYYY-MM-DD), in any order. */
  value: readonly string[];
  /** The days toggled on after a press, sorted and without repeats. */
  onChange: (value: string[]) => void;
  /** Days between `min` and `max` that cannot be toggled, such as days with no games. */
  isDateDisabled?: (date: string) => boolean;
  /** A BCP 47 tag; by default the nearest `lang`, then en-US. */
  locale?: string;
  /** 0 is Sunday (default), 1 is Monday. */
  weekStartsOn?: WeekStart;
  /**
   * Words read after a toggled-on day's name, saying what on means
   * ("day off"); the pressed state is read either way.
   */
  toggledLabel?: string;
  /** No day can be toggled; the days still take focus. */
  disabled?: boolean;
};
