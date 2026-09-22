import { describe, expect, it } from 'vitest';

import {
  assertMinuteStep,
  formatClockTime,
  formatClockTimeLabel,
  formatHourLabel,
  formatMinuteLabel,
  hourOptions,
  minuteOptions,
  parseClockTime,
} from './clock-time.js';

describe('clock time', () => {
  it('parses zero-padded 24-hour times only', () => {
    expect(parseClockTime('09:30')).toEqual({ hour: 9, minute: 30 });
    expect(parseClockTime('23:59')).toEqual({ hour: 23, minute: 59 });
    expect(parseClockTime('24:00')).toBeNull();
    expect(parseClockTime('9:30')).toBeNull();
    expect(parseClockTime('09:60')).toBeNull();
    expect(formatClockTime({ hour: 7, minute: 5 })).toBe('07:05');
  });

  it('accepts minute steps that tile the hour', () => {
    expect(minuteOptions(15)).toEqual([0, 15, 30, 45]);
    expect(minuteOptions(30)).toEqual([0, 30]);
    expect(hourOptions()).toHaveLength(24);
    expect(() => assertMinuteStep(7)).toThrow(RangeError);
    expect(() => assertMinuteStep(60)).toThrow(RangeError);
    expect(() => assertMinuteStep(10)).not.toThrow();
  });

  it('labels hours and values for the locale', () => {
    expect(formatHourLabel(9, 'en-US')).toBe('9 AM');
    expect(formatHourLabel(21, 'en-US')).toBe('9 PM');
    expect(formatHourLabel(9, 'es-419')).toMatch(/^0?9/);
    expect(formatMinuteLabel(5)).toBe(':05');
    expect(formatClockTimeLabel('21:30', 'en-US')).toBe('9:30 PM');
    expect(formatClockTimeLabel('', 'en-US')).toBe('');
  });
});
