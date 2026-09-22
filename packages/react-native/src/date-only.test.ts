import { describe, expect, it } from 'vitest';

import {
  formatDateOnly,
  isOutsideDateRange,
  parseDateOnly,
  toLocalDate,
} from './date-only.js';

describe('date-only', () => {
  it('parses valid calendar dates and rejects impossible ones', () => {
    expect(parseDateOnly('2026-02-28')).toEqual({
      year: 2026,
      month: 2,
      day: 28,
    });
    expect(parseDateOnly('2024-02-29')).not.toBeNull();
    expect(parseDateOnly('2026-02-29')).toBeNull();
    expect(parseDateOnly('2026-13-01')).toBeNull();
    expect(parseDateOnly('2026-04-31')).toBeNull();
    expect(parseDateOnly('26-04-01')).toBeNull();
    expect(parseDateOnly('')).toBeNull();
  });

  it('round-trips through the padded string form', () => {
    expect(formatDateOnly({ year: 2026, month: 3, day: 7 })).toBe('2026-03-07');
  });

  it('bounds values by min and max and ignores the empty value', () => {
    expect(isOutsideDateRange('2026-01-01', '2026-01-02')).toBe(true);
    expect(isOutsideDateRange('2026-01-05', '2026-01-02', '2026-01-04')).toBe(
      true,
    );
    expect(isOutsideDateRange('2026-01-03', '2026-01-02', '2026-01-04')).toBe(
      false,
    );
    expect(isOutsideDateRange('', '2026-01-02')).toBe(false);
  });

  it('builds a local noon date so formatting stays on the same day', () => {
    const date = toLocalDate({ year: 2026, month: 3, day: 29 });
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2026, 2, 29,
    ]);
    expect(date.getHours()).toBe(12);
  });
});
