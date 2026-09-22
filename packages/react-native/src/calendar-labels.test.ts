import { describe, expect, it } from 'vitest';

import {
  formatDateLabel,
  monthTitle,
  weekdayLabels,
} from './calendar-labels.js';

describe('calendar labels', () => {
  it('names weekdays in display order for the locale', () => {
    expect(weekdayLabels('en-US', 1)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
    expect(weekdayLabels('es-419', 0)[0]).toBe('dom');
  });

  it('formats month titles and date labels without UTC shifts', () => {
    expect(monthTitle({ year: 2026, month: 9 }, 'en-US')).toBe(
      'September 2026',
    );
    expect(formatDateLabel('2026-09-21', 'en-US', 'medium')).toBe(
      'Sep 21, 2026',
    );
    expect(formatDateLabel('2026-09-21', 'en-US', 'full')).toBe(
      'Monday, September 21, 2026',
    );
    expect(formatDateLabel('', 'en-US', 'medium')).toBe('');
  });
});
