/**
 * Checks a pager's place: `pageCount` a whole number from 1 and `page` a
 * whole number from 1 to `pageCount`. Pages count from 1, as people read
 * them. Anything else throws a `RangeError`.
 */
export function assertPaginationPages(page: number, pageCount: number): void {
  if (!Number.isInteger(pageCount) || pageCount < 1)
    throw new RangeError(
      `Pagination pageCount must be a whole number from 1: ${String(pageCount)}`,
    );
  if (!Number.isInteger(page) || page < 1 || page > pageCount)
    throw new RangeError(
      `Pagination page must be a whole number from 1 to ${pageCount}: ${String(page)}`,
    );
}

/** The page a step goes to, or `null` at the end it cannot pass. */
export function paginationStep(
  page: number,
  pageCount: number,
  direction: 'previous' | 'next',
): number | null {
  const target = direction === 'previous' ? page - 1 : page + 1;
  return target < 1 || target > pageCount ? null : target;
}

/** The steps' names, one per step, each a word or two (not blank). */
export function assertPaginationLabels(labels: {
  previous: string;
  next: string;
}): void {
  for (const key of ['previous', 'next'] as const)
    if (typeof labels?.[key] !== 'string' || labels[key].trim() === '')
      throw new RangeError(`Pagination labels.${key} must be a word or two`);
}
