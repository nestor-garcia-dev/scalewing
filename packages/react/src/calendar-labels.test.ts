import { describe, expect, it } from 'vitest';

import {
  formatDateLabel,
  monthNames,
  monthTitle,
  weekdayLabels,
} from './calendar-labels.js';

describe('calendar labels', () => {
  it('names weekdays in display order for the week start', () => {
    const sunday = weekdayLabels('en-US', 0);
    expect(sunday[0]).toEqual({ short: 'Sun', long: 'Sunday' });
    expect(sunday[6]?.long).toBe('Saturday');
    const monday = weekdayLabels('es', 1);
    expect(monday[0]?.long).toBe('lunes');
    expect(monday[6]?.long).toBe('domingo');
  });

  it('names months and titles in the locale', () => {
    expect(monthNames('en-US')[0]).toBe('January');
    expect(monthNames('es')[2]).toBe('marzo');
    expect(monthTitle({ year: 2024, month: 3 }, 'en-US')).toBe('March 2024');
    expect(monthTitle({ year: 2024, month: 3 }, 'es')).toBe('marzo de 2024');
  });

  it('speaks a full date without shifting the day', () => {
    expect(formatDateLabel('2024-03-10', 'en-US')).toBe(
      'Sunday, March 10, 2024',
    );
    expect(formatDateLabel('2024-11-03', 'es')).toBe(
      'domingo, 3 de noviembre de 2024',
    );
    expect(formatDateLabel('', 'en-US')).toBe('');
  });
});
