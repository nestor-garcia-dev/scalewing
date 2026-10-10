import { type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';

export type DescriptionListProps = Omit<
  HTMLAttributes<HTMLDListElement>,
  'children'
> & {
  /** The list's `DescriptionItem`s. */
  children: ReactNode;
};

/**
 * Terms and what each one says, one item per row: the term in a start
 * column as wide as the widest term (up to 40% of the list), the detail
 * beside it, a hairline between rows, every row aligned to its top. Below
 * the layout breakpoint (`md`) each term sits over its detail.
 */
export function DescriptionList({
  children,
  className,
  ...rest
}: DescriptionListProps) {
  return (
    <dl className={cx('sw-description-list', className)} {...rest}>
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
  /** What the term says: text, a link, or several lines. */
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
