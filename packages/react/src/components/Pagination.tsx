import { forwardRef, type HTMLAttributes } from 'react';

import { type AccessibleName } from '../accessible-name.js';
import { cx } from '../class-names.js';
import {
  assertPaginationLabels,
  assertPaginationPages,
  paginationStep,
} from '../pagination-pages.js';
import { Button } from './Button.js';

/** The steps' accessible names, in the product's words. */
export type PaginationLabels = {
  /** Names the step to the page before, such as "Previous page". */
  previous: string;
  /** Names the step to the page after, such as "Next page". */
  next: string;
};

export type PaginationProps = Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'aria-label' | 'aria-labelledby'
> &
  AccessibleName & {
    /** The page shown, from 1. */
    page: number;
    /** How many pages there are, from 1. */
    pageCount: number;
    /** Called with the page a step goes to; never past either end. */
    onPageChange: (page: number) => void;
    /**
     * What the page shows, in the product's words, such as "1–25 of 130
     * changes". It is announced politely when it changes.
     */
    rangeLabel: string;
    labels: PaginationLabels;
  };

/**
 * Previous and next steps through a list shown a page at a time, beside
 * the consumer's words for what the page shows, in a navigation landmark
 * named by `aria-label` or `aria-labelledby`. Each step is an icon-only
 * neutral Button named by `labels`. At either end its step looks disabled
 * (`aria-disabled`) but stays a Tab stop, so focus is never dropped when
 * the last page is reached, and a press there does nothing. Invalid pages
 * or an empty step label (`labels.previous` or `labels.next`) throw a
 * `RangeError`.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    { className, labels, onPageChange, page, pageCount, rangeLabel, ...rest },
    ref,
  ) {
    assertPaginationPages(page, pageCount);
    assertPaginationLabels(labels);

    const step = (direction: 'previous' | 'next') => {
      const target = paginationStep(page, pageCount, direction);
      return (
        <Button
          aria-disabled={target === null || undefined}
          aria-label={labels[direction]}
          className="sw-pagination-step"
          disabledAppearance="neutral"
          onPress={() => {
            if (target !== null) onPageChange(target);
          }}
          size="sm"
          variant="neutral"
        >
          <span
            aria-hidden="true"
            className={`sw-pagination-glyph sw-pagination-glyph-${direction}`}
          />
        </Button>
      );
    };

    return (
      <nav ref={ref} className={cx('sw-pagination', className)} {...rest}>
        <span
          aria-atomic="true"
          aria-live="polite"
          className="sw-pagination-range"
        >
          {rangeLabel}
        </span>
        <span className="sw-pagination-steps">
          {step('previous')}
          {step('next')}
        </span>
      </nav>
    );
  },
);
