import {
  type DateRangeButtonValue,
  type DateRangePreset,
} from '@scalewing/react';

/** The survey station's fixed today, so the demo reads the same every day. */
export const surveyToday = '2026-10-13';

/** Noon UTC on a YYYY-MM-DD date, so no time zone moves the day. */
function noonOf(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}

export function shiftDays(value: string, days: number): string {
  const date = noonOf(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Days in a range, both ends counted. */
export function rangeLength({ start, end }: DateRangeButtonValue): number {
  return (
    Math.round((noonOf(end).getTime() - noonOf(start).getTime()) / 864e5) + 1
  );
}

/** The range of the same length just before or after `range`. */
export function stepRange(
  range: DateRangeButtonValue,
  direction: 1 | -1,
): DateRangeButtonValue {
  const days = rangeLength(range) * direction;
  return {
    start: shiftDays(range.start, days),
    end: shiftDays(range.end, days),
  };
}

function monthStart(value: string, monthsBack: number): string {
  const date = noonOf(value);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - monthsBack);
  return date.toISOString().slice(0, 10);
}

/** The survey's quick ranges, each ending by `today`. */
export function surveyPresets(today: string): DateRangePreset[] {
  const year = today.slice(0, 4);
  return [
    {
      id: 'week',
      label: 'Last 7 days',
      range: { start: shiftDays(today, -7), end: shiftDays(today, -1) },
    },
    {
      id: 'month',
      label: 'This month',
      range: { start: monthStart(today, 0), end: today },
    },
    {
      id: 'last-month',
      label: 'Last month',
      range: {
        start: monthStart(today, 1),
        end: shiftDays(monthStart(today, 0), -1),
      },
    },
    {
      id: 'quarter',
      label: 'Last 90 days',
      range: { start: shiftDays(today, -90), end: shiftDays(today, -1) },
    },
    {
      id: 'year',
      label: 'This year',
      range: { start: `${year}-01-01`, end: today },
    },
    {
      id: 'last-year',
      label: 'Last year',
      range: {
        start: `${Number(year) - 1}-01-01`,
        end: `${Number(year) - 1}-12-31`,
      },
    },
  ];
}
