import { describe, expect, it } from 'vitest';

import { weekdayOf } from './calendar-month.js';
import {
  enabledDates,
  initialFocusDate,
  nearestEnabled,
  toggleDate,
  toggleKeyTarget,
} from './components/date-toggle/toggle-dates.js';

// Sundays only, 2027-03-28 to 2027-06-27.
const min = '2027-03-28';
const max = '2027-06-27';
const sundays = enabledDates(min, max, (date) => weekdayOf(date) !== 0);
const context = { isEnabled: sundays, min, max, rtl: false };

describe('toggleDate', () => {
  it('adds or removes a day, sorted, without repeats', () => {
    expect(toggleDate(['2027-04-11', '2027-04-04'], '2027-03-28')).toEqual([
      '2027-03-28',
      '2027-04-04',
      '2027-04-11',
    ]);
    expect(toggleDate(['2027-04-04', '2027-04-04'], '2027-04-04')).toEqual([]);
  });
});

describe('enabledDates and nearestEnabled', () => {
  it('allows days inside the bounds that are not disabled', () => {
    expect(sundays('2027-03-28')).toBe(true);
    expect(sundays('2027-03-29')).toBe(false);
    expect(sundays('2027-03-21')).toBe(false);
    expect(enabledDates(min, max)('2027-03-29')).toBe(true);
  });

  it('walks to the nearest enabled day inside the bounds, or none', () => {
    expect(nearestEnabled('2027-03-29', 1, sundays, min, max)).toBe(
      '2027-04-04',
    );
    expect(nearestEnabled('2027-06-26', 1, sundays, min, max)).toBe(
      '2027-06-27',
    );
    expect(nearestEnabled('2027-03-27', -1, sundays, min, max)).toBeNull();
  });
});

describe('initialFocusDate', () => {
  it('starts on the first toggled day, else the first enabled day', () => {
    expect(
      initialFocusDate(['2027-05-02', '2027-04-18'], sundays, min, max),
    ).toBe('2027-04-18');
    expect(initialFocusDate([], sundays, min, max)).toBe('2027-03-28');
    expect(
      initialFocusDate(
        [],
        enabledDates(min, max, () => true),
        min,
        max,
      ),
    ).toBeNull();
  });
});

describe('toggleKeyTarget', () => {
  it('skips days that cannot be toggled with the arrows', () => {
    expect(toggleKeyTarget('ArrowRight', '2027-03-28', context)).toBe(
      '2027-04-04',
    );
    expect(toggleKeyTarget('ArrowLeft', '2027-04-04', context)).toBe(
      '2027-03-28',
    );
    expect(toggleKeyTarget('ArrowDown', '2027-03-28', context)).toBe(
      '2027-04-04',
    );
    expect(toggleKeyTarget('ArrowUp', '2027-03-28', context)).toBeNull();
    expect(toggleKeyTarget('ArrowRight', '2027-06-27', context)).toBeNull();
  });

  it('swaps left and right in right-to-left', () => {
    expect(
      toggleKeyTarget('ArrowLeft', '2027-03-28', { ...context, rtl: true }),
    ).toBe('2027-04-04');
  });

  it('goes to the month’s first and last enabled day with Home and End', () => {
    expect(toggleKeyTarget('Home', '2027-04-18', context)).toBe('2027-04-04');
    expect(toggleKeyTarget('End', '2027-04-04', context)).toBe('2027-04-25');
    // March's first enabled day is min itself.
    expect(toggleKeyTarget('Home', '2027-03-28', context)).toBe('2027-03-28');
  });

  it('goes to the next or previous month’s first enabled day with PageDown and PageUp', () => {
    expect(toggleKeyTarget('PageDown', '2027-04-18', context)).toBe(
      '2027-05-02',
    );
    expect(toggleKeyTarget('PageUp', '2027-04-18', context)).toBe('2027-03-28');
    expect(toggleKeyTarget('PageUp', '2027-03-28', context)).toBeNull();
    expect(toggleKeyTarget('PageDown', '2027-06-27', context)).toBeNull();
    expect(toggleKeyTarget('Tab', '2027-04-18', context)).toBeNull();
  });

  it('skips a month with no enabled day, never landing later with PageUp', () => {
    // April has nothing to toggle.
    const noApril = enabledDates(
      min,
      max,
      (date) => weekdayOf(date) !== 0 || date.startsWith('2027-04'),
    );
    const skip = { ...context, isEnabled: noApril };
    expect(toggleKeyTarget('PageUp', '2027-05-09', skip)).toBe('2027-03-28');
    expect(toggleKeyTarget('PageDown', '2027-03-28', skip)).toBe('2027-05-02');
    const onlyMay = enabledDates(
      min,
      max,
      (date) => !date.startsWith('2027-05'),
    );
    expect(
      toggleKeyTarget('PageUp', '2027-05-09', {
        ...context,
        isEnabled: onlyMay,
      }),
    ).toBeNull();
  });
});
