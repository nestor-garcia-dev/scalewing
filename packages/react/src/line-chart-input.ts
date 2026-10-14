import { dayNumber } from './chart-dates.js';
import { type ChartStrokeTone, chartStrokeTones } from './css/chart-tones.js';
import { isOneOf } from './is-one-of.js';
import { type LineChartCurve, lineChartCurves } from './line-chart-path.js';

/** A value on a date (`YYYY-MM-DD`). */
export type LineChartPoint = { x: string; y: number };

/** A downward triangle on the line at one of its points' dates, with words. */
export type LineChartMarker = {
  x: string;
  label: string;
  tone: ChartStrokeTone;
};

/** A period to box, from its first date to its last. */
export type LineChartPeriod = { from: string; to: string };

export type LineChartInput = {
  label: string;
  valueLabel?: string;
  points: readonly LineChartPoint[];
  curve: LineChartCurve;
  tone: ChartStrokeTone;
  markers: readonly LineChartMarker[];
  markersLabel?: string;
  ticks?: readonly string[];
  highlight?: LineChartPeriod;
};

function refuse(message: string): never {
  throw new RangeError(`LineChart ${message}`);
}

function assertWords(what: string, value: unknown): void {
  if (typeof value !== 'string' || value.trim() === '')
    refuse(`${what} must not be empty`);
}

/** A date's day count, or a refusal naming what it was. */
export function lineChartDay(what: string, value: string): number {
  const day = typeof value === 'string' ? dayNumber(value) : null;
  if (day === null)
    refuse(`${what} must be a YYYY-MM-DD date: ${String(value)}`);
  return day;
}

function assertTone(what: string, tone: unknown): void {
  if (!isOneOf(chartStrokeTones, tone))
    refuse(
      `${what} must be one of ${chartStrokeTones.join(', ')}; received ${String(tone)}`,
    );
}

/**
 * Refuses what a line chart cannot draw, with a `RangeError`: empty words,
 * a date that is not `YYYY-MM-DD`, points out of date order, a value that
 * is not finite, an unknown curve or tone, a marker off the points' dates
 * or markers without `markersLabel`, a tick outside the points' dates, and
 * a period that ends before it starts.
 */
export function assertLineChartInput(input: LineChartInput): void {
  assertWords('label', input.label);
  if (input.valueLabel !== undefined)
    assertWords('valueLabel', input.valueLabel);
  if (!isOneOf(lineChartCurves, input.curve))
    refuse(
      `curve must be one of ${lineChartCurves.join(', ')}; received ${String(input.curve)}`,
    );
  assertTone('tone', input.tone);
  let previous = -Infinity;
  for (const point of input.points) {
    const day = lineChartDay('point x', point.x);
    if (day < previous)
      refuse(
        `points must be in date order: ${point.x} comes after a later date`,
      );
    previous = day;
    if (typeof point.y !== 'number' || !Number.isFinite(point.y))
      refuse(`point y must be a finite number: ${String(point.y)}`);
  }
  const dates = new Set(input.points.map((point) => point.x));
  if (input.markers.length > 0) assertWords('markersLabel', input.markersLabel);
  for (const marker of input.markers) {
    if (!dates.has(marker.x))
      refuse(`marker x must be one of the points' dates: ${String(marker.x)}`);
    assertWords('marker label', marker.label);
    assertTone('marker tone', marker.tone);
  }
  const first = input.points[0]?.x;
  const last = input.points.at(-1)?.x;
  for (const tick of input.ticks ?? []) {
    const day = lineChartDay('tick', tick);
    if (
      first === undefined ||
      day < lineChartDay('point x', first) ||
      day > lineChartDay('point x', last!)
    )
      refuse(`tick must fall within the points' dates: ${tick}`);
  }
  if (input.highlight) {
    const from = lineChartDay('highlight from', input.highlight.from);
    const to = lineChartDay('highlight to', input.highlight.to);
    if (to < from) refuse('highlight must not end before it starts');
  }
}
