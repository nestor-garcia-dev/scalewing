import {
  type ChartPlot,
  type ChartTick,
  labelGutter,
  labelledPlaces,
  ticksClearOf,
  valueTicks,
  valueY,
} from './chart-axis.js';
import {
  chartCompactWidth,
  chartGap,
  chartInset,
  chartMinPlotWidth,
  chartPlotHeight,
  chartTextWidth,
  chartType,
} from './chart-metrics.js';
import {
  alignedChartScales,
  chartScale,
  type ChartScale,
  extentThroughZero,
} from './chart-scale.js';
import {
  type ColumnChartMode,
  columnSpans,
  type PlacedColumn,
  placeColumns,
} from './column-chart-bars.js';
import { calloutRows, type PlacedCallout } from './column-chart-callouts.js';
import { chartHairline } from './css/chart-marks.js';

export type ColumnChartLayoutInput = {
  width: number;
  categories: readonly string[];
  series: readonly (readonly number[])[];
  mode: ColumnChartMode;
  /** The line's values, and the words at its last value (or none). */
  line: { values: readonly number[]; endLabel: string | null } | null;
  highlight: number | null;
  callouts: readonly { index: number; text: string }[];
  formatTick: (value: number) => string;
};

export type ColumnChartLayout = {
  width: number;
  height: number;
  compact: boolean;
  plot: ChartPlot;
  ticks: ChartTick[];
  lineTicks: ChartTick[];
  columns: PlacedColumn[];
  categoryLabels: { index: number; x: number; y: number; text: string }[];
  highlight: { x: number; y: number; width: number; height: number } | null;
  line: {
    points: { x: number; y: number }[];
    end: { x: number; y: number; text: string } | null;
  } | null;
  callouts: PlacedCallout[];
};

function scalesFor(input: ColumnChartLayoutInput): {
  values: ChartScale;
  line: ChartScale | null;
} {
  const spans = columnSpans(input.series, input.categories.length, input.mode);
  const columns = extentThroughZero(spans.flatMap((s) => [s.low, s.high]));
  if (!input.line) return { values: chartScale(columns), line: null };
  const [values, line] = alignedChartScales(
    columns,
    extentThroughZero(input.line.values),
  );
  return { values, line };
}

/**
 * Lays a column chart out at a width: its value axis on the left (and a
 * line's own scale on the right, its zero and grid lines level with the
 * columns'), the columns, the category labels (fewer when they would
 * crowd), the boxed period, the line with its last value beside its axis,
 * and the callouts pinned in rows above the plot. A compact chart (under
 * `chartCompactWidth`) has a shorter plot and draws no callouts: they are
 * listed under it.
 */
export function columnChartLayout(
  input: ColumnChartLayoutInput,
): ColumnChartLayout {
  const { width, categories } = input;
  const compact = width < chartCompactWidth;
  const scales = scalesFor(input);
  const tickWords = scales.values.ticks.map(input.formatTick);
  const lineWords = scales.line ? scales.line.ticks.map(input.formatTick) : [];
  const endLabel = input.line?.endLabel ?? null;
  const left = labelGutter(tickWords);
  const endRoom = endLabel ? Math.ceil(chartTextWidth(endLabel)) + chartGap : 0;
  // A line's axis words, unless they would leave the plot too narrow.
  const lineWordsShown =
    scales.line !== null &&
    width - left - chartGap - Math.max(labelGutter(lineWords), endRoom) >=
      chartMinPlotWidth;
  const rightGutter = scales.line
    ? chartGap + Math.max(lineWordsShown ? labelGutter(lineWords) : 0, endRoom)
    : chartGap;
  const right = Math.max(left + 1, width - rightGutter);
  const band = categories.length > 0 ? (right - left) / categories.length : 0;
  const centre = (index: number) => left + band * (index + 0.5);

  const placed = compact
    ? { rows: 0, callouts: [] }
    : calloutRows(input.callouts, centre, { left: 0, right: width });
  const top =
    placed.rows * chartType.lineHeight + chartGap + chartType.lineHeight / 2;
  const plot: ChartPlot = {
    left,
    right,
    top,
    bottom: top + chartPlotHeight(compact),
  };

  const columns = placeColumns(
    { series: input.series, categories: categories.length, mode: input.mode },
    scales.values,
    plot,
    band,
  );
  const line =
    input.line && scales.line
      ? input.line.values.map((value, index) => ({
          x: centre(index),
          y: valueY(value, scales.line!, plot),
        }))
      : null;
  const last = line?.at(-1);
  const end =
    last && endLabel
      ? { x: right + chartGap, y: last.y, text: endLabel }
      : null;
  const lineTicks =
    scales.line && lineWordsShown
      ? valueTicks(scales.line, plot, input.formatTick)
      : [];

  return {
    width,
    height: plot.bottom + chartGap + chartType.lineHeight,
    compact,
    plot,
    ticks: valueTicks(scales.values, plot, input.formatTick),
    lineTicks: end ? ticksClearOf(lineTicks, end.y) : lineTicks,
    columns,
    categoryLabels: labelledPlaces(categories, band).map((index) => ({
      index,
      x: withinChart(centre(index), categories[index]!, width),
      y: plot.bottom + chartGap + chartType.fontSize,
      text: categories[index]!,
    })),
    highlight:
      input.highlight === null || categories.length === 0
        ? null
        : boxAround(left + band * input.highlight, band, plot),
    line: line ? { points: line, end } : null,
    callouts: placed.callouts.map((callout) =>
      leaderFrom(callout, columns, plot, scales.values),
    ),
  };
}

/**
 * The boxed period around a category's band, a little inside it and past
 * the plot's top and bottom; never narrower than a hairline on a chart so
 * dense a band is thinner than its inset.
 */
function boxAround(start: number, band: number, plot: ChartPlot) {
  const width = Math.max(band - chartInset, chartHairline);
  return {
    x: start + (band - width) / 2,
    y: plot.top - chartGap,
    width,
    height: plot.bottom - plot.top + chartGap + chartInset,
  };
}

/** A label's centre, moved in so its words stay inside the chart's width. */
function withinChart(x: number, text: string, width: number): number {
  const half = chartTextWidth(text) / 2;
  return Math.min(Math.max(x, half), width - half);
}

/** A callout's leader starts just above its category's tallest column. */
function leaderFrom(
  callout: PlacedCallout,
  columns: readonly PlacedColumn[],
  plot: ChartPlot,
  scale: ChartScale,
): PlacedCallout {
  let top = valueY(0, scale, plot);
  for (const column of columns)
    if (column.category === callout.index) top = Math.min(top, column.y);
  return {
    ...callout,
    leaderEnd: Math.max(top - chartInset, callout.leaderStart),
  };
}
