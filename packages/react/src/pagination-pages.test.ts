import { describe, expect, it } from 'vitest';

import {
  assertPaginationLabels,
  assertPaginationPages,
  paginationStep,
} from './pagination-pages.js';

describe('paginationStep', () => {
  it('steps one page either way', () => {
    expect(paginationStep(3, 6, 'previous')).toBe(2);
    expect(paginationStep(3, 6, 'next')).toBe(4);
  });

  it('cannot pass either end', () => {
    expect(paginationStep(1, 6, 'previous')).toBeNull();
    expect(paginationStep(6, 6, 'next')).toBeNull();
    expect(paginationStep(1, 1, 'previous')).toBeNull();
    expect(paginationStep(1, 1, 'next')).toBeNull();
  });
});

describe('assertPaginationPages', () => {
  it('accepts a page from 1 to the count', () => {
    expect(() => assertPaginationPages(1, 1)).not.toThrow();
    expect(() => assertPaginationPages(6, 6)).not.toThrow();
  });

  it.each([0, -1, 1.5, Number.NaN])(
    'throws for a page count of %s',
    (count) => {
      expect(() => assertPaginationPages(1, count)).toThrow(
        new RangeError(
          `Pagination pageCount must be a whole number from 1: ${String(count)}`,
        ),
      );
    },
  );

  it.each([0, 7, 2.5, Number.NaN])('throws for page %s of 6', (page) => {
    expect(() => assertPaginationPages(page, 6)).toThrow(
      new RangeError(
        `Pagination page must be a whole number from 1 to 6: ${String(page)}`,
      ),
    );
  });
});

describe('assertPaginationLabels', () => {
  it('accepts a word or two per step', () => {
    expect(() =>
      assertPaginationLabels({ previous: 'Previous page', next: 'Next page' }),
    ).not.toThrow();
  });

  it.each(['previous', 'next'] as const)('throws for a blank %s', (key) => {
    expect(() =>
      assertPaginationLabels({
        previous: 'Previous page',
        next: 'Next page',
        [key]: ' ',
      }),
    ).toThrow(new RangeError(`Pagination labels.${key} must be a word or two`));
  });

  it('throws for a missing name', () => {
    expect(() =>
      assertPaginationLabels({ previous: 'Previous page' } as never),
    ).toThrow(new RangeError('Pagination labels.next must be a word or two'));
  });
});
