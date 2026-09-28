import { describe, expect, it } from 'vitest';

import { dateEntryValidity } from './date-entry-validity.js';
import { defaultDateFieldLabels } from './date-field-labels.js';

describe('date entry validity', () => {
  const labels = defaultDateFieldLabels;

  it('reports text that is not a date', () => {
    expect(dateEntryValidity(null, labels)).toBe('Enter a valid date.');
  });

  it('reports a date outside min and max', () => {
    expect(dateEntryValidity('2024-02-29', labels, '2024-03-01')).toBe(
      'Choose a date in the allowed range.',
    );
    expect(
      dateEntryValidity('2025-01-01', labels, undefined, '2024-12-31'),
    ).toBe('Choose a date in the allowed range.');
  });

  it('is valid for a blank entry or an allowed date', () => {
    expect(dateEntryValidity('', labels, '2024-03-01')).toBe('');
    expect(
      dateEntryValidity('2024-03-01', labels, '2024-03-01', '2024-03-31'),
    ).toBe('');
  });
});
