import { type ReactNode } from 'react';

import { type BadgeTone } from '../../css/css-data.js';
import { type DenominationLabelWidth } from '../../css/css-denomination-aligned.js';

export type { DenominationLabelWidth };

export type DenominationGridTone = BadgeTone;

export type DenominationGridLayout = 'strip' | 'tiles';

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
};

export type DenominationGridProps = {
  label: string;
  columns: readonly DenominationGridColumn[];
  rows: readonly DenominationGridRow[];
  layout?: DenominationGridLayout;
  subtotal?: (count: number, column: DenominationGridColumn) => string;
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
};
