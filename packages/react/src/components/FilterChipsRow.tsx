import { type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { hasSlot } from './slot.js';
import {
  filterChipsOverflows,
  type FilterChipsOverflow,
} from './filter-chips/options.js';

export type FilterChipsRowProps = {
  /** The row's chip groups, each a `FilterChips` with its own name. */
  children: ReactNode;
  /**
   * A group set apart at the row's end, such as one toggle of another kind
   * after the filters ("Missing a translation"); on its own line's end when
   * the row wraps.
   */
  end?: ReactNode;
  /**
   * `wrap` (the default): the groups wrap onto more lines. `scroll`: every
   * group's chips stay on one row that scrolls sideways together inside
   * the row's own box, never the page; a group's own `overflow` gives way.
   */
  overflow?: FilterChipsOverflow;
};

/**
 * Several chip groups on one row: the groups keep their own names and
 * choices (a radio group and a checkbox, say), and the row lays them out
 * together, wrapping or scrolling as one, with an optional group at its end.
 */
export function FilterChipsRow({
  children,
  end,
  overflow = 'wrap',
}: FilterChipsRowProps) {
  if (!(filterChipsOverflows as readonly unknown[]).includes(overflow))
    throw new RangeError(
      `Unknown FilterChipsRow overflow: ${String(overflow)}`,
    );
  return (
    <div
      className={cx(
        'sw-filter-chips-row',
        overflow === 'scroll' && 'sw-filter-chips-row-scroll',
      )}
    >
      {children}
      {hasSlot(end) ? (
        <div className="sw-filter-chips-row-end">{end}</div>
      ) : null}
    </div>
  );
}
