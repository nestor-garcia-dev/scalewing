import { describe, expect, it } from 'vitest';

import { dataBarGeometry } from './data-bar-geometry.js';

describe('dataBarGeometry', () => {
  it('places a range as shares of the domain, from the smaller end', () => {
    const placed = { start: 0.25, size: 0.5, zero: null, zeroEnd: null };
    expect(dataBarGeometry(25, 75, 0, 100)).toEqual(placed);
    expect(dataBarGeometry(75, 25, 0, 100)).toEqual(placed);
  });

  it('marks zero on a domain from below zero to above it', () => {
    expect(dataBarGeometry(0, -50, -100, 100)).toEqual({
      start: 0.25,
      size: 0.25,
      zero: 0.5,
      zeroEnd: 'end',
    });
    expect(dataBarGeometry(0, 30, -10, 30).zero).toBe(0.25);
  });

  it('has no zero line when zero is an end of the domain', () => {
    expect(dataBarGeometry(0, 5, 0, 10).zero).toBeNull();
    expect(dataBarGeometry(-5, 0, -10, 0).zero).toBeNull();
  });

  it('says which end of a bar meets the zero line', () => {
    expect(dataBarGeometry(0, 30, -50, 50).zeroEnd).toBe('start');
    expect(dataBarGeometry(-30, 0, -50, 50).zeroEnd).toBe('end');
    expect(dataBarGeometry(10, 30, -50, 50).zeroEnd).toBeNull();
    expect(dataBarGeometry(0, 0, -50, 50).zeroEnd).toBeNull();
    // Without a zero line, no end meets it.
    expect(dataBarGeometry(0, 30, 0, 50).zeroEnd).toBeNull();
  });

  it('clamps ends past the domain to it', () => {
    expect(dataBarGeometry(-20, 120, 0, 100)).toEqual({
      start: 0,
      size: 1,
      zero: null,
      zeroEnd: null,
    });
  });

  it('draws nothing for an empty range', () => {
    expect(dataBarGeometry(40, 40, 0, 100).size).toBe(0);
  });

  it.each([
    ['from', [Number.NaN, 1, 0, 2]],
    ['to', [0, Number.POSITIVE_INFINITY, 0, 2]],
    ['min', [0, 1, Number.NaN, 2]],
    ['max', [0, 1, 0, Number.NEGATIVE_INFINITY]],
  ] as const)('throws for a non-finite %s', (name, args) => {
    expect(() => dataBarGeometry(...args)).toThrow(
      new RangeError(
        `DataBar ${name} must be a finite number: ${String(
          args[['from', 'to', 'min', 'max'].indexOf(name)],
        )}`,
      ),
    );
  });

  it('throws when min is not under max', () => {
    expect(() => dataBarGeometry(0, 1, 5, 5)).toThrow(
      new RangeError('DataBar min must be under max: min 5, max 5'),
    );
  });
});
