import { describe, expect, it } from 'vitest';

import {
  assertMinuteStep,
  composeClockTime,
  formatClockTime,
  formatClockTimeLabel,
  formatHourLabel,
  formatMinuteLabel,
  formatWheelHourLabel,
  formatWheelMinuteLabel,
  hourColumnOptions,
  minuteOptions,
  parseClockTime,
  periodLabels,
  splitClockTime,
  usesTwelveHourClock,
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

  it('detects the hour cycle per locale', () => {
    expect(usesTwelveHourClock('en-US')).toBe(true);
    expect(usesTwelveHourClock('es-419')).toBe(true);
    expect(usesTwelveHourClock('en-GB')).toBe(false);
    expect(usesTwelveHourClock('de-DE')).toBe(false);
  });

  it('lays out the hour column for each cycle', () => {
    expect(hourColumnOptions(true)).toEqual([
      12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
    expect(hourColumnOptions(false)).toHaveLength(24);
    expect(hourColumnOptions(false)[0]).toBe(0);
    expect(hourColumnOptions(false)[23]).toBe(23);
  });

  it('splits and composes around noon and midnight on a 12-hour clock', () => {
    expect(splitClockTime({ hour: 0, minute: 15 }, true)).toEqual({
      hour: 12,
      minute: 15,
      period: 'am',
    });
    expect(splitClockTime({ hour: 12, minute: 0 }, true)).toEqual({
      hour: 12,
      minute: 0,
      period: 'pm',
    });
    expect(splitClockTime({ hour: 18, minute: 30 }, true)).toEqual({
      hour: 6,
      minute: 30,
      period: 'pm',
    });
    expect(splitClockTime({ hour: 18, minute: 30 }, false)).toEqual({
      hour: 18,
      minute: 30,
      period: null,
    });
    expect(composeClockTime({ hour: 12, minute: 15, period: 'am' })).toEqual({
      hour: 0,
      minute: 15,
    });
    expect(composeClockTime({ hour: 12, minute: 0, period: 'pm' })).toEqual({
      hour: 12,
      minute: 0,
    });
    expect(composeClockTime({ hour: 6, minute: 30, period: 'pm' })).toEqual({
      hour: 18,
      minute: 30,
    });
    expect(composeClockTime({ hour: 18, minute: 30, period: null })).toEqual({
      hour: 18,
      minute: 30,
    });
  });

  it('labels wheel rows and periods for the locale', () => {
    expect(periodLabels('en-US')).toEqual({ am: 'AM', pm: 'PM' });
    expect(periodLabels('es-419').am).toMatch(/a/i);
    expect(periodLabels('es-419').pm).toMatch(/p/i);
    expect(formatWheelHourLabel(6, true, 'en-US')).toBe('6');
    expect(formatWheelHourLabel(6, false, 'en-GB')).toBe('06');
    expect(formatWheelMinuteLabel(0)).toBe('00');
    expect(formatWheelMinuteLabel(45)).toBe('45');
  });
});
