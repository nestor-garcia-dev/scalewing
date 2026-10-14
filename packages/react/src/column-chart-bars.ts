import { type ChartPlot, valueY } from './chart-axis.js';
import { type ChartScale } from './chart-scale.js';
import { chartColumnGap } from './css/chart-marks.js';

/** How a category's columns sit: one on another, or side by side. */
export const columnChartModes = ['stacked', 'grouped'] as const;

export type ColumnChartMode = (typeof columnChartModes)[number];

/**
 * One series' column in one category, in values: from `low` to `high`,
 * and which of the category's slots it takes (always 0 when stacked).
 */
export type ColumnSpan = {
  series: number;
  category: number;
  slot: number;
  low: number;
  high: number;
};

/**
 * Each series' column in each category, in values. Stacked, the positive
 * values stack up from zero and the negative ones down from it, each in
 * series order; grouped, every value runs from zero in its own slot. A
 * zero value has no column.
 */
export function columnSpans(
  series: readonly (readonly number[])[],
  categories: number,
  mode: ColumnChartMode,
): ColumnSpan[] {
  const spans: ColumnSpan[] = [];
  for (let category = 0; category < categories; category += 1) {
    let up = 0;
    let down = 0;
    series.forEach((values, index) => {
      const value = values[category]!;
      if (value === 0) return;
      if (mode === 'grouped') {
        spans.push({
          series: index,
          category,
          slot: index,
          low: Math.min(0, value),
          high: Math.max(0, value),
        });
      } else if (value > 0) {
        spans.push({
          series: index,
          category,
          slot: 0,
          low: up,
          high: up + value,
        });
        up += value;
      } else {
        spans.push({
          series: index,
          category,
          slot: 0,
          low: down + value,
          high: down,
        });
        down += value;
      }
    });
  }
  return spans;
}

/** A drawn column: which series and category, and its box. */
export type PlacedColumn = {
  series: number;
  category: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

/** How much of a category's width its stacked column, or its group, takes. */
const stackedShare = 0.6;
const groupedShare = 0.72;

/** Each span's box: a column, or its slot in the category's group. */
export function placeColumns(
  input: {
    series: readonly (readonly number[])[];
    categories: number;
    mode: ColumnChartMode;
  },
  scale: ChartScale,
  plot: ChartPlot,
  band: number,
): PlacedColumn[] {
  const slots = input.mode === 'grouped' ? input.series.length : 1;
  const group = band * (input.mode === 'grouped' ? groupedShare : stackedShare);
  const slot = group / slots;
  const gap = slots > 1 ? Math.min(chartColumnGap, slot / 4) : 0;
  return columnSpans(input.series, input.categories, input.mode).map((span) => {
    const top = valueY(span.high, scale, plot);
    const bottom = valueY(span.low, scale, plot);
    // A value too small to see still shows: a column at least 1 px tall,
    // standing on zero (or hanging from it).
    const height = Math.max(bottom - top, 1);
    const y = span.low < 0 && span.high <= 0 ? top : bottom - height;
    return {
      series: span.series,
      category: span.category,
      x:
        plot.left +
        band * span.category +
        (band - group) / 2 +
        slot * span.slot +
        gap / 2,
      y,
      width: slot - gap,
      height,
    };
  });
}
