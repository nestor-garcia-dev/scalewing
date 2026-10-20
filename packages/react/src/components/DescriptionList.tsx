import { type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import {
  assertDescriptionListLayout,
  type DescriptionListLayout,
} from './description-list-layout.js';

export {
  descriptionListLayouts,
  type DescriptionListLayout,
} from './description-list-layout.js';

export type DescriptionListProps = Omit<
  HTMLAttributes<HTMLDListElement>,
  'children'
> & {
  /** The list's `DescriptionItem`s. */
  children: ReactNode;
  /**
   * `columns` (the default): the terms in a start column and the details
   * beside them, each term over its detail below `md`. `spread`: each
   * row's term at its start and its detail at its end, end-aligned, side
   * by side at every width, for a short box of facts.
   */
  layout?: DescriptionListLayout;
};

/**
 * Terms and what each one says, one item per row: the term in a start
 * column as wide as the widest term (up to 40% of the list), the detail
 * beside it, a hairline between rows, every row aligned to its top. Below
 * the layout breakpoint (`md`) each term sits over its detail. `spread`
 * sets each detail at its row's end instead, beside its term at every width.
 */
export function DescriptionList({
  children,
  className,
  layout = 'columns',
  ...rest
}: DescriptionListProps) {
  assertDescriptionListLayout(layout);
  return (
    <dl
      className={cx(
        'sw-description-list',
        layout === 'spread' && 'sw-description-list-spread',
        className,
      )}
      {...rest}
    >
      {children}
    </dl>
  );
}

export type DescriptionItemProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  /**
   * What the row describes, such as a name; the consumer's own `Text`. Each
   * child of the term, and of the detail, is its own line.
   */
  term: ReactNode;
  /**
   * What the term says: text, a link, or several lines. Each child is its
   * own line, as wide as its content unless it sets its own width (a
   * `Progress` fills the detail); wrap words and a link that share a line
   * in one element such as `Inline`.
   */
  children: ReactNode;
};

/** One row of a `DescriptionList`: a `dt` and its `dd` in one group. */
export function DescriptionItem({
  term,
  children,
  className,
  ...rest
}: DescriptionItemProps) {
  return (
    <div className={cx('sw-description-item', className)} {...rest}>
      <dt className="sw-description-term">{term}</dt>
      <dd className="sw-description-detail">{children}</dd>
    </div>
  );
}
