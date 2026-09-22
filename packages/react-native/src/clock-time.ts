const CLOCK_TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

export type ClockTime = {
  hour: number;
  minute: number;
};

export function parseClockTime(value: string): ClockTime | null {
  const parts = CLOCK_TIME.exec(value);
  if (!parts) return null;
  return { hour: Number(parts[1]), minute: Number(parts[2]) };
}

export function isClockTime(value: string): boolean {
  return parseClockTime(value) !== null;
}

export function formatClockTime(time: ClockTime): string {
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
}

export function assertClockTime(name: string, value: string, empty = false) {
  if (empty && value === '') return;
  if (!isClockTime(value))
    throw new RangeError(`${name} must be a valid HH:MM time`);
}

export function assertMinuteStep(step: number) {
  if (!Number.isInteger(step) || step < 1 || step > 30 || 60 % step !== 0)
    throw new RangeError('minuteStep must divide 60 and be at most 30');
}

export function minuteOptions(step: number): number[] {
  return Array.from({ length: 60 / step }, (_, index) => index * step);
}

/** Whether the locale writes wall-clock hours on a 12-hour cycle. */
export function usesTwelveHourClock(locale: string | undefined): boolean {
  const { hourCycle } = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
  }).resolvedOptions();
  return hourCycle === 'h11' || hourCycle === 'h12';
}

/** The hour column: 12, 1 … 11 on a 12-hour clock, otherwise 0 … 23. */
export function hourColumnOptions(twelveHour: boolean): number[] {
  if (!twelveHour) return Array.from({ length: 24 }, (_, hour) => hour);
  return [12, ...Array.from({ length: 11 }, (_, index) => index + 1)];
}

export type ClockPeriod = 'am' | 'pm';

export const clockPeriods: readonly ClockPeriod[] = ['am', 'pm'];

/** The locale's own AM and PM words, read from Intl rather than hardcoded. */
export function periodLabels(
  locale: string | undefined,
): Record<ClockPeriod, string> {
  const dayPeriod = (hour: number) =>
    new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true })
      .formatToParts(referenceDate({ hour, minute: 0 }))
      .find((part) => part.type === 'dayPeriod')?.value ?? '';
  return { am: dayPeriod(9), pm: dayPeriod(21) };
}

export type ClockParts = {
  /** Column hour: 12, 1 … 11 on a 12-hour clock, 0 … 23 otherwise. */
  hour: number;
  minute: number;
  period: ClockPeriod | null;
};

/** Splits a 24-hour time into the columns a wheel shows for the cycle. */
export function splitClockTime(
  time: ClockTime,
  twelveHour: boolean,
): ClockParts {
  if (!twelveHour)
    return { hour: time.hour, minute: time.minute, period: null };
  return {
    hour: time.hour % 12 === 0 ? 12 : time.hour % 12,
    minute: time.minute,
    period: time.hour < 12 ? 'am' : 'pm',
  };
}

/** Composes a 24-hour time from wheel columns; the period is ignored on 24h. */
export function composeClockTime(parts: ClockParts): ClockTime {
  if (parts.period === null) return { hour: parts.hour, minute: parts.minute };
  const base = parts.hour % 12;
  return {
    hour: parts.period === 'pm' ? base + 12 : base,
    minute: parts.minute,
  };
}

/** The wheel shows bare digits; the period column carries AM or PM. */
export function formatWheelHourLabel(
  hour: number,
  twelveHour: boolean,
  locale: string | undefined,
): string {
  if (twelveHour) return new Intl.NumberFormat(locale).format(hour);
  return String(hour).padStart(2, '0');
}

export function formatWheelMinuteLabel(minute: number): string {
  return String(minute).padStart(2, '0');
}

/** A local Date on a fixed day so Intl formats only the time. */
function referenceDate(time: ClockTime): Date {
  return new Date(2023, 0, 1, time.hour, time.minute);
}

export function formatHourLabel(
  hour: number,
  locale: string | undefined,
): string {
  return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(
    referenceDate({ hour, minute: 0 }),
  );
}

export function formatMinuteLabel(minute: number): string {
  return `:${String(minute).padStart(2, '0')}`;
}

export function formatClockTimeLabel(
  value: string,
  locale: string | undefined,
): string {
  const time = parseClockTime(value);
  if (!time) return '';
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(referenceDate(time));
}
