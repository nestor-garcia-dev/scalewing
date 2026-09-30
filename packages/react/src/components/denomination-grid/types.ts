import { type ReactNode } from 'react';

import { type BadgeTone } from '../../css/css-data.js';

export type DenominationGridTone = BadgeTone;

export type DenominationGridLayout = 'strip' | 'tiles';

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
   * The strip's row-label column width, in characters of the label type
   * (`ch`), such as the longest label the consumer can show plus its icon.
   * Strips with the same width, columns and `labelWidth` line their columns
   * up from grid to grid; a longer label wraps beside its icon. A positive
   * integer. Only the strip has that column.
   */
  labelWidth?: number;
};
