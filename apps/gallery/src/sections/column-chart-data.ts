import {
  type ChartLegendItem,
  type ColumnChartCallout,
  type ColumnChartSeries,
} from '@scalewing/react';

/** Thirteen weeks of a lake survey, each named by its first day. */
export const surveyWeeks = [
  'Jul 14',
  'Jul 21',
  'Jul 28',
  'Aug 4',
  'Aug 11',
  'Aug 18',
  'Aug 25',
  'Sep 1',
  'Sep 8',
  'Sep 15',
  'Sep 22',
  'Sep 29',
  'Oct 6',
] as const;

/** Each week's change in birds at the lake, by species: up and down. */
export const lakeChange: readonly ColumnChartSeries[] = [
  {
    id: 'herons',
    label: 'Herons',
    tone: 'blue',
    values: [3, -5, -4, 1, -8, -5, 2, -5, -1, 2, -3, 52, -1],
  },
  {
    id: 'egrets',
    label: 'Egrets, with the dawn recount',
    tone: 'purple',
    values: [0, 3, -3, 50, 0, -3, 0, -4, 0, 0, 0, -8, 0],
  },
];

/** The running total of both species' change. */
export const lakeRunningTotal: readonly number[] = lakeChange[0]!.values.reduce<
  number[]
>((total, heron, index) => {
  const week = heron + lakeChange[1]!.values[index]!;
  total.push((total.at(-1) ?? 0) + week);
  return total;
}, []);

export const lakeCallouts: readonly ColumnChartCallout[] = [
  { index: 3, text: 'Aug 4 · Egret roost found +50', tone: 'purple' },
  { index: 11, text: 'Sep 29 · Heron colony arrived +52', tone: 'blue' },
];

export const lakeKey: readonly ChartLegendItem[] = [
  { label: 'Herons', swatch: 'bar', tone: 'blue' },
  { label: 'Egrets, with the dawn recount', swatch: 'bar', tone: 'purple' },
  { label: 'Running total', swatch: 'line', tone: 'accent' },
  { label: 'This week', swatch: 'box', tone: 'accent' },
];

/** Sightings by day and by night, side by side each week. */
export const sightings: readonly ColumnChartSeries[] = [
  {
    id: 'day',
    label: 'By day',
    tone: 'neutral',
    values: [112, 99, 133, 104, 135, 97, 124, 106, 103, 107, 90, 102, 100],
  },
  {
    id: 'night',
    label: 'By night',
    tone: 'teal',
    values: [114, 113, 151, 154, 142, 131, 120, 133, 112, 127, 126, 155, 129],
  },
];

/** Records corrected each week: three kinds, stacked as counts. */
export const corrections: readonly ColumnChartSeries[] = [
  {
    id: 'removed',
    label: 'Removed',
    tone: 'rose',
    values: [0, 3, 2, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0],
  },
  {
    id: 'corrected',
    label: 'Corrected or added',
    tone: 'blue',
    values: [0, 2, 0, 1, 1, 0, 0, 0, 0, 0, 2, 1, 1],
  },
  {
    id: 'recounts',
    label: 'Recounts accepted',
    tone: 'orange',
    values: [0, 0, 2, 3, 1, 2, 0, 1, 0, 0, 0, 0, 0],
  },
];
