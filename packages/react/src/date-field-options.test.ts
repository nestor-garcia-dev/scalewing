import { describe, expect, it } from 'vitest';

import {
  defaultDateFieldLabels,
  resolveDateFieldLabels,
} from './date-field-labels.js';
import { DEFAULT_DATE_LOCALE, resolveDateLocale } from './date-field-locale.js';

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
