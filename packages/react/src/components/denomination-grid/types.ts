import { type ReactNode } from 'react';

import { type BadgeTone } from '../../css/css-data.js';
import {
  type DenominationGridFrame,
  type DenominationTotalEmphasis,
} from '../../css/css-denomination-appearance.js';
import { type DenominationCellToneAppearance } from '../../css/css-denomination-cell-tones.js';
import { type DenominationLabelAppearance } from '../../css/css-denomination-label.js';
import { type DenominationLabelWidth } from '../../css/css-denomination-aligned.js';
import { type StepperLimitAppearance } from '../Stepper.js';

export type {
  DenominationCellToneAppearance,
  DenominationGridFrame,
  DenominationLabelWidth,
  DenominationTotalEmphasis,
};

export type DenominationGridTone = BadgeTone;

export type DenominationGridLayout = 'strip' | 'tiles';

/** How a negative count reads: in the danger colour, or plain text. */
export const denominationNegativeAppearances = ['danger', 'plain'] as const;
export type DenominationGridNegativeAppearance =
  (typeof denominationNegativeAppearances)[number];

/**
 * The widths below which a strip is drawn transposed: the denominations as
 * rows, the grid's rows as columns.
 */
export const denominationTransposeBreakpoints = ['md', 'lg'] as const;
export type DenominationTransposeBreakpoint =
  (typeof denominationTransposeBreakpoints)[number];

/**
 * What a named tiles row is to assistive technology: a `region` (a landmark,
 * the default) or a `group` (named, but not in the landmark list).
 */
export type DenominationGridRowRole = 'region' | 'group';

export type DenominationGridColumn = {
  key: string;
  label: string;
  /** A muted note after the label, such as "× 100" for a strap of $1 bills. */
  caption?: string;
};

/** How a row sits among the others: `quiet` sets it on the subtle fill, for a row to compare against. */
export type DenominationGridRowEmphasis = 'default' | 'quiet';

/**
 * Makes a strip row's counts editable: one `Stepper` per column, holding the
 * row's `cells` (`null` is an empty box), named by the row label and the
 * column's label and caption ("Counted $1 × 100"). The minimum is 0. The
 * grid does no arithmetic: recompute the row's `total` in `onChange`.
 */
export type DenominationGridEntry = {
  onChange: (columnKey: string, value: number | null) => void;
  /** The − buttons' name, such as "One less". */
  decrementLabel: string;
  /** The + buttons' name, such as "One more". */
  incrementLabel: string;
  /** A cap per column (`null` for none), such as the bills the drawer holds. */
  max?: readonly (number | null)[];
  /** A message per column (`null` for none), shown under that count. */
  errors?: readonly (string | null)[];
  /** What an empty box shows, such as "0". */
  placeholder?: string;
  /**
   * The Steppers' `limitAppearance`: `plain` keeps − at 0 (and + at a cap)
   * in its usual look instead of faded; it is still disabled.
   */
  limitAppearance?: StepperLimitAppearance;
};

/**
 * A line under a strip row that gives each column's value, such as the
 * money its count adds up to: its own table row on the subtle fill, named
 * in the label column, one consumer-formatted value per column centred
 * under its count (`null` or `''` leaves a cell blank, such as for a zero
 * count), and the row's `total` in the total column. The grid does no
 * arithmetic and no currency formatting.
 */
export type DenominationGridValueRow = {
  /** The line's name in the label column, such as "Value". */
  label: string;
  /** One formatted value, or `null` for none, per column. */
  cells: readonly (string | null)[];
};

export type DenominationGridRow = {
  id: string;
  label: string;
  cells: readonly (number | null)[];
  icon?: ReactNode;
  tone?: DenominationGridTone;
  signed?: boolean;
  total?: string;
  /**
   * A tone per count, one entry per column (null for none), for a single
   * count that needs attention, such as a bill the vault is short of. The
   * count is set in the tone and, in the tiles layout, its tile's border
   * too, in place; an entry count's border takes it. The tone never says
   * why alone: put that in words.
   */
  cellTones?: readonly (DenominationGridTone | null)[];
  /** A muted line under the label, such as "from the customer". */
  caption?: string;
  /**
   * How a negative count reads: `danger` (the default) in the danger
   * colour; `plain` in the text colour, with its minus sign, for counts
   * that go out by design, such as bills paid out (cash out is never an
   * error, so never red).
   */
  negativeAppearance?: DenominationGridNegativeAppearance;
  /** The `strip` layout only. */
  emphasis?: DenominationGridRowEmphasis;
  /**
   * A row that does not apply now (the `strip` layout only): its entry is
   * disabled, its label, counts and total fade, and the row is
   * `aria-disabled`.
   */
  disabled?: boolean;
  /**
   * Count entry for this row (the `strip` layout only). Its counts are zero
   * or more, it is not `signed`, and its label is its own among the entry
   * rows, as each column's label and caption are, so every count has its
   * own name. A cell tone draws the count's border in that tone (an
   * `accent` one is the `Stepper`'s changed look); a message in
   * `entry.errors` wins.
   */
  entry?: DenominationGridEntry;
  /**
   * A value line under this row (the `strip` layout only); the row's
   * `total` moves to it, and each entry count is described by its value.
   */
  valueRow?: DenominationGridValueRow;
};

export type DenominationGridProps = {
  label: string;
  columns: readonly DenominationGridColumn[];
  rows: readonly DenominationGridRow[];
  layout?: DenominationGridLayout;
  subtotal?: (count: number, column: DenominationGridColumn) => string;
  /**
   * What a zero or empty read-only count shows, `—` by default. An empty
   * string leaves those counts blank, so only the counts that are there
   * stand out (the column header still names each cell).
   */
  zeroLabel?: string;
  /**
   * Names the strip's total column, such as "Total": a column header over
   * the totals from md up, visually hidden below md, where each total sits
   * under its row's label. Only the strip has that column.
   */
  totalLabel?: string;
  /**
   * The role of each named row in the tiles layout: `region` (the default,
   * a landmark named by the row's label) or `group` (the same name, not a
   * landmark), for a page with many grids whose rows should not fill the
   * landmark list. Only the tiles layout has row containers.
   */
  rowRole?: DenominationGridRowRole;
  /**
   * Lines the strip's columns up with every other strip of the same columns
   * in a container of the same width, such as the cards of a feed: the row
   * labels take this width (`xs` to `xl`, 4 to 16 rem, the `Table` column
   * sizes; pick the narrowest that holds the longest label's longest word)
   * and the count columns share the rest equally, whatever the counts are.
   * Without it each strip sizes its columns by its own content. Only the
   * strip has a label column.
   */
  labelWidth?: DenominationLabelWidth;
  /**
   * `tone` (the default) marks each row label with its row's tone: a
   * stripe at its start and the words in the tone. `plain` sets every row
   * label in the text color at label weight with no stripe, for a grid
   * whose rows need no color to tell apart; a row's tone still colors its
   * total.
   */
  labelAppearance?: DenominationLabelAppearance;
  /**
   * `table` frames the strip: its surface inside a hairline with rounded
   * corners, the heading row on the subtle fill, a rule between columns,
   * and the counts at label size, centred under their heads. `none` (the
   * default) leaves open rows on the page's surface. Only the strip has a
   * frame.
   */
  frame?: DenominationGridFrame;
  /**
   * `strong` sets the row totals in bold label type, a neutral row's in the
   * text color and a toned row's in its tone; `default` keeps them in data
   * type in the row's tone (a neutral row's muted).
   */
  totalEmphasis?: DenominationTotalEmphasis;
  /**
   * How a `cellTones` tone shows on a strip's read-only count: `text` (the
   * default) sets the count in the tone; `pill` sets it on a rounded tint of
   * the tone in the tone's ink, such as a difference in danger or a
   * changed count in accent. Entry counts and tiles keep their tone border.
   */
  cellToneAppearance?: DenominationCellToneAppearance;
  /**
   * Below this breakpoint (`md` or `lg`) the strip is drawn transposed,
   * for a phone: one row per denomination (its label and caption) and one
   * column per grid row (its label over its counts, entry steppers or
   * value line), the totals in a last row. Its names, entry, cell tones
   * and zero label are the strip's. The `strip` layout only.
   */
  transposeBelow?: DenominationTransposeBreakpoint;
  /**
   * The digits an entry count holds without clipping, from 3 (the
   * default room) to 6: a column of steppers keeps that many digits'
   * width before the strip scrolls, such as 4 for a count in the
   * thousands in a grid of seven columns. Entry rows only.
   */
  countDigits?: number;
};
