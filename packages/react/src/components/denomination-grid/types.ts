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
   * (`ch`), such as the longest label the consumer can show plus its icon:
   * an integer from 1 to 40. Each count column then keeps one token width
   * and the strip is only as wide as its columns, so a total sits right
   * after its counts. Strips with the same columns and `labelWidth` line up
   * when their containers fit every column at its width; in a narrower
   * container the label column gives way, wrapping its words beside the
   * icon, and they still line up while no total shows (totals take no
   * width below `md`) and each label's longest word fits. A visible total
   * in a container too narrow, a strip that must scroll, a word longer
   * than `labelWidth` or a count wider than its column can shift them.
   * Only the strip has that column.
   */
  labelWidth?: number;
};
