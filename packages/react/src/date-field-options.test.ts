import { describe, expect, it } from 'vitest';

import {
  defaultDateFieldLabels,
  resolveDateFieldLabels,
} from './date-field-labels.js';
import {
  DEFAULT_DATE_LOCALE,
  resolveDateEntryLocale,
  resolveDateLocale,
} from './date-field-locale.js';
import { dateEntryPattern, dateEntryPlaceholder } from './date-entry.js';

describe('DateField labels', () => {
  it('keeps English defaults under consumer translations', () => {
    const labels = resolveDateFieldLabels({
      chooseDate: 'Elegir fecha',
      yearPlaceholder: 'AAAA',
    });
    expect(labels.chooseDate).toBe('Elegir fecha');
    expect(labels.yearPlaceholder).toBe('AAAA');
    expect(labels.today).toBe(defaultDateFieldLabels.today);
  });

  it('fails closed on empty text', () => {
    expect(() => resolveDateFieldLabels({ today: ' ' })).toThrow(
      'labels.today must be non-empty text',
    );
  });
});

describe('DateField locale', () => {
  it('uses an explicit locale and rejects a malformed tag', () => {
    expect(resolveDateLocale('es-mx', 'en')).toBe('es-MX');
    expect(() => resolveDateLocale('en_US', null)).toThrow(RangeError);
    expect(() => resolveDateLocale('', null)).toThrow(RangeError);
  });

  it('falls back to the nearest lang, then en-US', () => {
    expect(resolveDateLocale(undefined, 'es')).toBe('es');
    expect(resolveDateLocale(undefined, null)).toBe(DEFAULT_DATE_LOCALE);
    expect(resolveDateLocale(undefined, '')).toBe(DEFAULT_DATE_LOCALE);
    expect(resolveDateLocale(undefined, 'not a tag')).toBe(DEFAULT_DATE_LOCALE);
  });
});

describe('DateField entry locale', () => {
  it('defaults to the resolved locale', () => {
    expect(resolveDateEntryLocale(undefined, 'es-US')).toBe('es-US');
  });

  it('takes an explicit tag apart from the names locale', () => {
    // Intl writes every Spanish locale day first, including es-US.
    expect(dateEntryPattern('es-US').order).toEqual(['day', 'month', 'year']);
    const entry = resolveDateEntryLocale('en-us', 'es-US');
    expect(entry).toBe('en-US');
    const pattern = dateEntryPattern(entry);
    expect(pattern.order).toEqual(['month', 'day', 'year']);
    expect(
      dateEntryPlaceholder(pattern, { day: 'DD', month: 'MM', year: 'AAAA' }),
    ).toBe('MM/DD/AAAA');
  });

  it('rejects a malformed tag, naming the prop', () => {
    expect(() => resolveDateEntryLocale('en_US', 'es-US')).toThrow(
      new RangeError('entryLocale must be a BCP 47 language tag'),
    );
    expect(() => resolveDateEntryLocale('', 'es-US')).toThrow(RangeError);
  });
});
