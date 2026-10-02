import { type ReactNode } from 'react';

import { type BadgeTone } from '../../css/css-data.js';

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
   * too, in place. The tone never says why alone: put that in words.
   */
  cellTones?: readonly (DenominationGridTone | null)[];
};

export type DenominationGridProps = {
  label: string;
  columns: readonly DenominationGridColumn[];
  rows: readonly DenominationGridRow[];
  layout?: DenominationGridLayout;
  subtotal?: (count: number, column: DenominationGridColumn) => string;
  zeroLabel?: string;
  /**
   * Names the strip's total column for assistive technology (a visually
   * hidden column header), such as "Total". Only the strip has that column.
   */
  totalLabel?: string;
  /**
   * The role of each named row in the tiles layout: `region` (the default,
   * a landmark named by the row's label) or `group` (the same name, not a
   * landmark), for a page with many grids whose rows should not fill the
   * landmark list. Only the tiles layout has row containers.
   */
  rowRole?: DenominationGridRowRole;
};
