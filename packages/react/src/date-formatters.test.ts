import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  formatDateLabel,
  monthNames,
  weekdayLabels,
} from './calendar-labels.js';
import { dateFormatter, formatterDate } from './date-formatters.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('date formatters', () => {
  it('shares one formatter per locale and options', () => {
    const first = dateFormatter('fr', { month: 'long' });
    expect(dateFormatter('fr', { month: 'long' })).toBe(first);
    expect(dateFormatter('fr', { month: 'short' })).not.toBe(first);
    expect(dateFormatter('de', { month: 'long' })).not.toBe(first);
    expect(first.resolvedOptions().timeZone).toBe('UTC');
  });

  it('builds no formatter again when a calendar re-renders', () => {
    // Warm the cache the way a first render does.
    formatDateLabel('2024-03-10', 'it');
    weekdayLabels('it', 1);
    monthNames('it');
    const construct = vi.spyOn(Intl, 'DateTimeFormat');
    for (let day = 1; day <= 28; day += 1)
      formatDateLabel(`2024-02-${String(day).padStart(2, '0')}`, 'it');
    weekdayLabels('it', 1);
    monthNames('it');
    expect(construct).not.toHaveBeenCalled();
  });

  it('builds noon UTC dates that keep years below 100', () => {
    const date = formatterDate({ year: 50, month: 2, day: 3 });
    expect(date.getUTCFullYear()).toBe(50);
    expect(date.getUTCMonth()).toBe(1);
    expect(date.getUTCDate()).toBe(3);
    expect(date.getUTCHours()).toBe(12);
    expect(
      dateFormatter('en-US', { dateStyle: 'full' }).format(
        formatterDate({ year: 1, month: 1, day: 1 }),
      ),
    ).toBe('Monday, January 1, 1');
  });
});
