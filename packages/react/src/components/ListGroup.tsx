'use client';

import { forwardRef, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import {
  type ListGroupTileColumns,
  listTileColumnsClass,
} from '../css/css-list-tiles.js';
import {
  assertListGroup,
  listMaxHeightStyle,
  type ListGroupMaxHeight,
  type ListGroupVariant,
} from '../list-options.js';
import { ListRowContainer } from './list/list-row-container.js';
import { ScrollRegion } from './ScrollRegion.js';

export type ListGroupProps = {
  /** `ListRow` elements; the group draws a hairline between each pair. */
  children: ReactNode;
  /** Names the list, such as its card's heading. Required with `maxHeight`. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /**
   * `panel` (the default) is one bordered panel; `plain` draws no panel
   * and a hairline above the first row too, for rows inside a Card;
   * `tiles` sets each row on a panel of its own, in `tileColumns` equal
   * columns from `md` up and one a row below it, still one list.
   */
  variant?: ListGroupVariant;
  /** How many tiles share a row from `md` up (`tiles` only): 2, 3 (default) or 4. */
  tileColumns?: ListGroupTileColumns;
  /**
   * Bounds the list to a row count of its own region, `{ rows }` rows of a
   * title and one detail line, where the rest scroll; the region is a named
   * keyboard stop and shades an edge with more rows past it.
   */
  maxHeight?: ListGroupMaxHeight;
  /**
   * Pinned under the rows, outside the scroll, under a hairline: a total
   * the rows add up to, such as a `ListRow` with the count and the sum.
   */
  footer?: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Rows in one list (`ul`, its list role kept) with hairlines between them:
 * a panel of its own, or plain rows inside a surface; or the same list's
 * rows as tiles, each a panel. The ref reaches the outer box.
 */
export const ListGroup = forwardRef<HTMLDivElement, ListGroupProps>(
  function ListGroup(
    {
      children,
      'aria-label': label,
      'aria-labelledby': labelledBy,
      variant = 'panel',
      tileColumns,
      maxHeight,
      footer,
      className,
      id,
    },
    ref,
  ) {
    assertListGroup({
      label,
      labelledBy,
      variant,
      maxHeight,
      tileColumns,
      hasFooter: footer !== undefined,
    });
    const list = (
      <ul
        aria-label={label}
        aria-labelledby={labelledBy}
        className="sw-list"
        // A list styled without bullets loses its role in Safari.
        role="list"
      >
        <ListRowContainer.Provider value="li">
          {children}
        </ListRowContainer.Provider>
      </ul>
    );
    return (
      <div
        className={cx(
          'sw-list-group',
          `sw-list-group-${variant}`,
          variant === 'tiles' && listTileColumnsClass(tileColumns ?? 3),
          className,
        )}
        id={id}
        ref={ref}
      >
        {maxHeight === undefined ? (
          list
        ) : (
          <ScrollRegion
            aria-label={label}
            aria-labelledby={labelledBy}
            className="sw-list-group-scroll"
            style={listMaxHeightStyle(maxHeight)}
          >
            {list}
          </ScrollRegion>
        )}
        {footer === undefined ? null : (
          <div className="sw-list-group-footer">
            {/* A footer row is no list item, even in a list inside a row. */}
            <ListRowContainer.Provider value="div">
              {footer}
            </ListRowContainer.Provider>
          </div>
        )}
      </div>
    );
  },
);
