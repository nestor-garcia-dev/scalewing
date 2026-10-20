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
