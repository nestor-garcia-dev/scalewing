import { chartGap, chartTextWidth, chartType } from './chart-metrics.js';
import { type ChartScale, scaleShare } from './chart-scale.js';

/** A value axis's grid line and its words, at a height in the plot. */
export type ChartTick = {
  value: number;
  y: number;
  label: string;
};

/** A plot's edges, in the chart's pixels. */
export type ChartPlot = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

/** The height a value falls at in a plot, on a scale. */
export function valueY(value: number, scale: ChartScale, plot: ChartPlot) {
  return plot.bottom - scaleShare(value, scale) * (plot.bottom - plot.top);
}

/** A scale's ticks, placed in a plot and written by `format`. */
export function valueTicks(
  scale: ChartScale,
  plot: ChartPlot,
  format: (value: number) => string,
): ChartTick[] {
  return scale.ticks.map((value) => ({
    value,
    y: valueY(value, scale, plot),
    label: format(value),
  }));
}

/** The room a column of labels takes beside the plot, with its gap. */
export function labelGutter(labels: readonly string[]): number {
  let widest = 0;
  for (const label of labels) widest = Math.max(widest, chartTextWidth(label));
  return Math.ceil(widest) + chartGap;
}

/**
 * Which of `count` evenly spaced places, `slot` pixels apart, get their
 * label: every one when the widest label and a gap either side fit a
 * slot, otherwise every second, third and so on, counted back from the
 * last, so the latest place is always labelled.
 */
export function labelledPlaces(
  labels: readonly string[],
  slot: number,
): number[] {
  if (labels.length === 0) return [];
  let widest = 0;
  for (const label of labels) widest = Math.max(widest, chartTextWidth(label));
  const every = Math.max(1, Math.ceil((widest + chartGap * 2) / slot));
  const places: number[] = [];
  for (let index = labels.length - 1; index >= 0; index -= every)
    places.unshift(index);
  return places;
}

/**
 * Drops the ticks whose words would meet a label drawn at `y` in the same
 * column (such as a line's last value beside its axis).
 */
export function ticksClearOf(
  ticks: readonly ChartTick[],
  y: number,
): ChartTick[] {
  return ticks.filter((tick) => Math.abs(tick.y - y) >= chartType.lineHeight);
}
