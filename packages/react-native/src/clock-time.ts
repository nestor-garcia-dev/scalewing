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

export function hourOptions(): number[] {
  return Array.from({ length: 24 }, (_, hour) => hour);
}

export function minuteOptions(step: number): number[] {
  return Array.from({ length: 60 / step }, (_, index) => index * step);
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
