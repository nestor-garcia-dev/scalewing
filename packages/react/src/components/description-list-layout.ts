import { isOneOf } from '../is-one-of.js';

/**
 * How a DescriptionList lays out its rows: `columns` (the default), the
 * terms in a start column and the details beside them, each term over its
 * detail below `md`; `spread`, each row's term at its start and its detail
 * at its end, side by side at every width.
 */
export const descriptionListLayouts = ['columns', 'spread'] as const;
export type DescriptionListLayout = (typeof descriptionListLayouts)[number];

/** Fails closed on a layout the list cannot draw. */
export function assertDescriptionListLayout(layout: unknown): void {
  if (!isOneOf(descriptionListLayouts, layout))
    throw new RangeError(`Unknown DescriptionList layout: ${String(layout)}`);
}

/**
 * A fixed term column, so details line up across several lists on a page:
 * `sm` 8rem, `md` 12rem, `lg` 16rem, from `md` up and never more than half
 * the list. Only with the `columns` layout.
 */
export const descriptionListTermWidths = ['sm', 'md', 'lg'] as const;
export type DescriptionListTermWidth =
  (typeof descriptionListTermWidths)[number];

/** Fails closed on a term width the list cannot draw. */
export function assertDescriptionListTermWidth(
  termWidth: unknown,
  layout: DescriptionListLayout,
): void {
  if (termWidth === undefined) return;
  if (!isOneOf(descriptionListTermWidths, termWidth))
    throw new RangeError(
      `Unknown DescriptionList termWidth: ${String(termWidth)}`,
    );
  if (layout !== 'columns')
    throw new RangeError('DescriptionList termWidth needs the columns layout');
}
