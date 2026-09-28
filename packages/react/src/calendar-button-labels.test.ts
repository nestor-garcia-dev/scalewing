import { describe, expect, it } from 'vitest';

import { resolveCalendarButtonLabels } from './calendar-button-labels.js';
import { defaultDateFieldLabels } from './date-field-labels.js';

describe('calendar button labels', () => {
  it('fills the calendar words and the name separator from the defaults', () => {
    expect(resolveCalendarButtonLabels()).toEqual({
      calendar: defaultDateFieldLabels,
      nameSeparator: ', ',
    });
  });

  it('takes consumer words and a separator, including a lone space', () => {
    const resolved = resolveCalendarButtonLabels({
      today: '今日',
      nameSeparator: '、',
    });
    expect(resolved.calendar.today).toBe('今日');
    expect(resolved.nameSeparator).toBe('、');
    expect(
      resolveCalendarButtonLabels({ nameSeparator: ' ' }).nameSeparator,
    ).toBe(' ');
  });

  it('fails closed on empty words', () => {
    expect(() => resolveCalendarButtonLabels({ nameSeparator: '' })).toThrow(
      new RangeError('labels.nameSeparator must be non-empty text'),
    );
    expect(() => resolveCalendarButtonLabels({ year: ' ' })).toThrow(
      new RangeError('labels.year must be non-empty text'),
    );
  });
});
