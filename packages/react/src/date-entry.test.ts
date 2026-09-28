import { describe, expect, it } from 'vitest';

import {
  dateEntryPattern,
  dateEntryPlaceholder,
  formatDateEntry,
  isCompleteDateEntry,
  parseDateEntry,
} from './date-entry.js';

const letters = { day: 'DD', month: 'MM', year: 'YYYY' };

describe('typed date entry', () => {
  it('reads the numeric field order and separator from Intl', () => {
    expect(dateEntryPattern('en-US')).toEqual({
      order: ['month', 'day', 'year'],
      separator: '/',
    });
    expect(dateEntryPattern('es')).toEqual({
      order: ['day', 'month', 'year'],
      separator: '/',
    });
    expect(dateEntryPattern('de').separator).toBe('.');
    expect(dateEntryPattern('ja').order).toEqual(['year', 'month', 'day']);
    expect(dateEntryPattern('ko')).toEqual({
      order: ['year', 'month', 'day'],
      separator: '.',
    });
  });

  it('formats a value in the locale order with Latin digits', () => {
    expect(formatDateEntry('2024-03-10', dateEntryPattern('en-US'))).toBe(
      '03/10/2024',
    );
    expect(formatDateEntry('2024-03-10', dateEntryPattern('es-MX'))).toBe(
      '10/03/2024',
    );
    expect(formatDateEntry('2024-03-10', dateEntryPattern('de'))).toBe(
      '10.03.2024',
    );
    expect(formatDateEntry('2024-03-10', dateEntryPattern('ar-EG'))).toMatch(
      /^10\D+03\D+2024$/,
    );
    expect(formatDateEntry('', dateEntryPattern('en-US'))).toBe('');
  });

  it('builds the placeholder from the consumer letters', () => {
    expect(dateEntryPlaceholder(dateEntryPattern('en-US'), letters)).toBe(
      'MM/DD/YYYY',
    );
    expect(
      dateEntryPlaceholder(dateEntryPattern('es'), {
        day: 'DD',
        month: 'MM',
        year: 'AAAA',
      }),
    ).toBe('DD/MM/AAAA');
  });

  it('parses typed text in each locale order', () => {
    const us = dateEntryPattern('en-US');
    const es = dateEntryPattern('es');
    expect(parseDateEntry('03/10/2024', us)).toBe('2024-03-10');
    expect(parseDateEntry('3/10/2024', us)).toBe('2024-03-10');
    expect(parseDateEntry(' 3-10-2024 ', us)).toBe('2024-03-10');
    expect(parseDateEntry('03102024', us)).toBe('2024-03-10');
    expect(parseDateEntry('10/03/2024', es)).toBe('2024-03-10');
    expect(parseDateEntry('10.3.2024', es)).toBe('2024-03-10');
    expect(parseDateEntry('10032024', es)).toBe('2024-03-10');
    expect(parseDateEntry('2024/3/10', dateEntryPattern('ja'))).toBe(
      '2024-03-10',
    );
    expect(parseDateEntry('05/14/1961', us)).toBe('1961-05-14');
  });

  it('reads a four-digit first field as ISO in every locale', () => {
    expect(parseDateEntry('2024-03-10', dateEntryPattern('en-US'))).toBe(
      '2024-03-10',
    );
    expect(parseDateEntry('2024-03-10', dateEntryPattern('es'))).toBe(
      '2024-03-10',
    );
  });

  it('returns empty for blank text and null for text that is not a date', () => {
    const us = dateEntryPattern('en-US');
    expect(parseDateEntry('   ', us)).toBe('');
    for (const text of [
      '13/10/2024',
      '02/30/2024',
      '02/29/2023',
      '3/10/24',
      '3/10',
      '3/10/2024/1',
      '003/10/2024',
      'March 10 2024',
      '0310202',
      '00/10/2024',
      '01/01/0000',
    ])
      expect(parseDateEntry(text, us)).toBeNull();
  });

  it('calls typed text complete only when its last field is at full width', () => {
    const us = dateEntryPattern('en-US');
    const ja = dateEntryPattern('ja');
    // The US year ends the entry: four digits finish it, whatever came first.
    expect(isCompleteDateEntry('3/1/2024', us)).toBe(true);
    expect(isCompleteDateEntry('3/1/202', us)).toBe(false);
    // ISO ends with the day, which may still grow from 1 to 10.
    expect(isCompleteDateEntry('2024-03-1', us)).toBe(false);
    expect(isCompleteDateEntry('2024-03-10', us)).toBe(true);
    expect(isCompleteDateEntry('2024/3/1', ja)).toBe(false);
    expect(isCompleteDateEntry('2024/3/10', ja)).toBe(true);
    expect(isCompleteDateEntry('03102024', us)).toBe(true);
    expect(isCompleteDateEntry('0310202', us)).toBe(false);
    expect(isCompleteDateEntry('3/10', us)).toBe(false);
    expect(isCompleteDateEntry('', us)).toBe(false);
  });
});
