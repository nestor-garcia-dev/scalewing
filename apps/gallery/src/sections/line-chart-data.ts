import {
  type ChartLegendItem,
  type LineChartMarker,
  type LineChartPoint,
} from '@scalewing/react';

/** A date `days` after 2026-07-27, as YYYY-MM-DD. */
function dayAfterStart(days: number): string {
  const date = new Date(Date.UTC(2026, 6, 27 + days));
  return date.toISOString().slice(0, 10);
}

/** A short "Jul 27" for the axis and the table. */
export function shortDate(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[month! - 1]} ${day}`;
}

/**
 * Birds roosting at the reserve each night for 78 nights: the roost fills
 * through each week and empties when a flock leaves, a few times a month.
 */
const departures = [17, 26, 35, 47, 56, 65, 74];

export const roostNights: readonly LineChartPoint[] = Array.from(
  { length: 78 },
  (_, night) => {
    const sinceDeparture =
      night - (departures.filter((d) => d <= night).at(-1) ?? 0);
    const wave = Math.round(
      3600 + sinceDeparture * 520 + ((night * 37) % 11) * 140,
    );
    return { x: dayAfterStart(night), y: wave };
  },
);

export const flockDepartures: readonly LineChartMarker[] = departures.map(
  (night) => ({
    x: dayAfterStart(night),
    label: `${(((night * 13) % 40) + 5).toString()}00`,
    tone: 'warning',
  }),
);

/** Every third week's first night, and the last night. */
export const roostTicks: readonly string[] = [0, 21, 42, 63, 77].map(
  dayAfterStart,
);

export const lastWeek = { from: dayAfterStart(71), to: dayAfterStart(77) };

export const roostKey: readonly ChartLegendItem[] = [
  { label: 'Roosting at night', swatch: 'line', tone: 'accent' },
  { label: 'A flock left', swatch: 'marker', tone: 'warning' },
  { label: 'This week', swatch: 'box', tone: 'accent' },
];

/** Nest boxes lent to other reserves: a count that changes on a day. */
export const nestBoxesLent: readonly LineChartPoint[] = [
  { x: dayAfterStart(0), y: 10 },
  { x: dayAfterStart(0), y: 0 },
  { x: dayAfterStart(9), y: 10 },
  { x: dayAfterStart(11), y: 15 },
  { x: dayAfterStart(24), y: 5 },
  { x: dayAfterStart(36), y: 10 },
  { x: dayAfterStart(48), y: 20 },
  { x: dayAfterStart(60), y: 10 },
  { x: dayAfterStart(62), y: 30 },
  { x: dayAfterStart(70), y: 20 },
  { x: dayAfterStart(77), y: 20 },
];
