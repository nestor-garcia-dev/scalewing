import { describe, expect, it } from 'vitest';

import {
  assertDateRangeInput,
  type DateRangeInput,
} from './date-range-input.js';
import {
  defaultDateRangeButtonLabels,
  resolveDateRangeButtonLabels,
} from './date-range-labels.js';
import { formatRangeLong, formatRangeShort } from './date-range-words.js';

const valid: DateRangeInput = {
  label: 'Choose survey period',
  value: { start: '2026-10-06', end: '2026-10-12' },
  presets: [
    {
      id: 'week',
      label: 'Last 7 days',
      range: { start: '2026-10-06', end: '2026-10-12' },
    },
  ],
  min: '2025-01-01',
  max: '2026-10-13',
  maxDays: 366,
  today: '2026-10-13',
  weekStartsOn: 0,
};

function refuses(change: Partial<DateRangeInput>, message: string) {
  expect(() => assertDateRangeInput({ ...valid, ...change })).toThrow(message);
}

describe('assertDateRangeInput', () => {
  it('accepts a value outside the bounds, as CalendarButton does', () => {
    expect(() => assertDateRangeInput(valid)).not.toThrow();
    expect(() =>
      assertDateRangeInput({
        ...valid,
        value: { start: '2020-01-01', end: '2026-12-31' },
      }),
    ).not.toThrow();
  });

  it('refuses empty words and malformed or reversed dates', () => {
    refuses({ label: ' ' }, 'label must be non-empty text');
    refuses(
      { value: undefined as never },
      'value must be a { start, end } range',
    );
    refuses(
      { value: { start: '2026-10-12', end: '2026-10-06' } },
      'value.start must not be after value.end',
    );
    refuses(
      { value: { start: '2026-10-6', end: '2026-10-12' } },
      'value.start must be a valid YYYY-MM-DD date',
    );
    refuses({ min: '2027-01-01' }, 'min must not be after max');
    refuses({ today: '2026-13-01' }, 'today must be a valid YYYY-MM-DD date');
    refuses({ weekStartsOn: 2 }, 'weekStartsOn must be 0 or 1');
  });

  it('refuses a maxDays that is not a whole number from 1', () => {
    refuses({ maxDays: 0 }, 'maxDays must be a whole number from 1');
    refuses({ maxDays: 7.5 }, 'maxDays must be a whole number from 1');
    expect(() =>
      assertDateRangeInput({ ...valid, maxDays: undefined }),
    ).not.toThrow();
  });

  it('refuses presets a press could not pick, or that repeat an id', () => {
    const week = valid.presets[0]!;
    refuses(
      { presets: [{ ...week, id: '' }] },
      'presets must have non-empty ids and labels',
    );
    refuses(
      { presets: [{ ...week, label: '' }] },
      'presets must have non-empty ids and labels',
    );
    refuses({ presets: [week, week] }, 'presets must have unique ids: week');
    refuses(
      {
        presets: [
          { ...week, range: { start: '2026-10-01', end: '2026-10-31' } },
        ],
      },
      'preset week must lie inside min and max',
    );
    refuses(
      {
        presets: [
          { ...week, range: { start: '2024-12-01', end: '2025-01-31' } },
        ],
      },
      'preset week must lie inside min and max',
    );
    refuses({ maxDays: 6 }, 'preset week must not exceed maxDays');
  });
});

describe('resolveDateRangeButtonLabels', () => {
  it('keeps the English defaults under the consumer words', () => {
    const labels = resolveDateRangeButtonLabels({ apply: 'Show' });
    expect(labels.apply).toBe('Show');
    expect(labels.cancel).toBe('Cancel');
    expect(labels.dayCount(1)).toBe('1 day');
    expect(labels.dayCount(7)).toBe('7 days');
    expect(defaultDateRangeButtonLabels.nameSeparator).toBe(', ');
  });

  it('refuses empty words and a day count that is not a function', () => {
    expect(() => resolveDateRangeButtonLabels({ hint: ' ' })).toThrow(
      'labels.hint must be non-empty text',
    );
    expect(() => resolveDateRangeButtonLabels({ nameSeparator: '' })).toThrow(
      'labels.nameSeparator must be non-empty text',
    );
    expect(() =>
      resolveDateRangeButtonLabels({ nameSeparator: ' ' }),
    ).not.toThrow();
    expect(() =>
      resolveDateRangeButtonLabels({ dayCount: 'days' as never }),
    ).toThrow('labels.dayCount must be a function');
  });
});

describe('range words', () => {
  const week = { start: '2026-10-06', end: '2026-10-12' };

  function expected(
    locale: string,
    options: Intl.DateTimeFormatOptions,
    start: string,
    end: string,
  ) {
    return new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: 'UTC',
    }).formatRange(
      new Date(`${start}T12:00:00Z`),
      new Date(`${end}T12:00:00Z`),
    );
  }

  it('shares what both ends have, in the locale', () => {
    expect(formatRangeShort(week, 'en-US')).toBe(
      expected(
        'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' },
        week.start,
        week.end,
      ),
    );
    expect(formatRangeShort(week, 'en-US')).toMatch(/^Oct 6\s?–\s?12, 2026$/);
    expect(formatRangeShort(week, 'es')).toMatch(/^6\s?–\s?12 oct 2026$/);
    expect(
      formatRangeShort({ start: week.start, end: week.start }, 'en-US'),
    ).toBe('Oct 6, 2026');
  });

  it('writes the weekdays in the long form', () => {
    expect(formatRangeLong(week, 'en-US')).toMatch(
      /^Tue, Oct 6\s?–\s?Mon, Oct 12, 2026$/,
    );
    expect(
      formatRangeLong({ start: '2025-12-29', end: '2026-01-04' }, 'en-US'),
    ).toMatch(/^Mon, Dec 29, 2025\s?–\s?Sun, Jan 4, 2026$/);
  });

  it('writes both ends in full where formatRange is missing', () => {
    const formatRange = Intl.DateTimeFormat.prototype.formatRange;
    // @ts-expect-error: an older browser's Intl, without formatRange.
    delete Intl.DateTimeFormat.prototype.formatRange;
    try {
      expect(
        formatRangeShort({ start: '2026-11-06', end: '2026-11-12' }, 'en-US'),
      ).toBe('Nov 6, 2026 – Nov 12, 2026');
      expect(
        formatRangeShort({ start: '2026-11-06', end: '2026-11-06' }, 'en-US'),
      ).toBe('Nov 6, 2026');
    } finally {
      Intl.DateTimeFormat.prototype.formatRange = formatRange;
    }
  });

  it('is empty for a malformed end', () => {
    expect(
      formatRangeShort({ start: '2026-10-06', end: 'soon' }, 'en-US'),
    ).toBe('');
  });
});
