import {
  type ChartPlot,
  type ChartTick,
  endGutter,
  labelGutter,
  labelInside,
  periodBox,
  valueTicks,
  valueY,
} from './chart-axis.js';
import {
  chartCompactWidth,
  chartGap,
  chartPlotHeight,
  chartTextWidth,
  chartType,
} from './chart-metrics.js';
import { chartScale, extentThroughZero } from './chart-scale.js';
import { placeMarkers, type PlacedMarker } from './line-chart-markers.js';
import { closingIndexes } from './line-chart-points.js';
import {
  areaPath,
  type ChartPoint,
  type LineChartCurve,
  linePath,
} from './line-chart-path.js';

export type LineChartLayoutInput = {
  width: number;
  /** The points as day counts, in date order. */
  points: readonly { day: number; y: number }[];
  curve: LineChartCurve;
  area: boolean;
  /** Each marker's day (one of the points') and words. */
  markers: readonly { day: number; label: string }[];
  /** The days to label on the time axis, and their words. */
  ticks: readonly { day: number; text: string }[];
  /** The boxed period's first and last days. */
  highlight: { from: number; to: number } | null;
  /** The words at the line's last value, or none. */
  endLabel: string | null;
  formatTick: (value: number) => string;
};

export type LineChartLayout = {
  width: number;
  height: number;
  compact: boolean;
  plot: ChartPlot;
  ticks: ChartTick[];
  path: ChartPoint[];
  area: ChartPoint[];
  last: ChartPoint | null;
  end: { x: number; y: number; text: string } | null;
  dateLabels: { day: number; x: number; y: number; text: string }[];
  highlight: { x: number; y: number; width: number; height: number } | null;
  markers: PlacedMarker[];
};

/**
 * The time axis's labels: each asked-for day at its place, kept inside the
 * chart, and thinned from the last back so no two meet.
 */
function dateLabels(
  ticks: LineChartLayoutInput['ticks'],
  x: (day: number) => number,
  width: number,
  y: number,
): LineChartLayout['dateLabels'] {
  const kept: LineChartLayout['dateLabels'] = [];
  const sorted = [...ticks].sort((a, b) => b.day - a.day);
  for (const tick of sorted) {
    const centre = labelInside(x(tick.day), tick.text, width);
    const half = chartTextWidth(tick.text) / 2;
    const next = kept[0];
    if (
      next &&
      centre + half + chartGap * 2 > next.x - chartTextWidth(next.text) / 2
    )
      continue;
    kept.unshift({ day: tick.day, x: centre, y, text: tick.text });
  }
  return kept;
}

/**
 * Lays a line chart out at a width: its value axis on the left (through
 * zero), the line through its points by date (straight or in steps), the
 * area under it, its last value beside the plot's end, the time axis's
 * labels (fewer when they would meet), the boxed period, and each marker's
 * triangle and words. A compact chart (under `chartCompactWidth`) has a
 * shorter plot.
 */
export function lineChartLayout(input: LineChartLayoutInput): LineChartLayout {
  const { width, points } = input;
  const compact = width < chartCompactWidth;
  const scale = chartScale(extentThroughZero(points.map((p) => p.y)));
  const left = labelGutter(scale.ticks.map(input.formatTick));
  const right = Math.max(
    left + 1,
    width -
      endGutter({ width, left, axisWords: [], endLabel: input.endLabel })
        .gutter,
  );
  const top = chartGap + chartType.lineHeight / 2;
  const plot: ChartPlot = {
    left,
    right,
    top,
    bottom: top + chartPlotHeight(compact),
  };

  const first = points[0]?.day ?? 0;
  const span = (points.at(-1)?.day ?? first) - first;
  const dayWidth = span > 0 ? (right - left) / span : right - left;
  const x = (day: number) =>
    span > 0 ? left + (day - first) * dayWidth : (left + right) / 2;
  const placed = points.map((p) => ({
    x: x(p.day),
    y: valueY(p.y, scale, plot),
  }));
  const path = linePath(placed, input.curve);
  const last = placed.at(-1) ?? null;

  // A marker sits on its day's last point, the day's closing value.
  const closing = closingIndexes(points.map((p) => p.day));
  const markerPoints = input.markers.map((marker) => ({
    x: x(marker.day),
    y: placed[closing.get(marker.day) ?? -1]?.y ?? plot.bottom,
    label: marker.label,
  }));

  return {
    width,
    height: plot.bottom + chartGap + chartType.lineHeight,
    compact,
    plot,
    ticks: valueTicks(scale, plot, input.formatTick),
    path,
    area: input.area ? areaPath(path, valueY(0, scale, plot)) : [],
    last,
    end:
      last && input.endLabel
        ? { x: right + chartGap, y: last.y, text: input.endLabel }
        : null,
    dateLabels: dateLabels(
      input.ticks,
      x,
      width,
      plot.bottom + chartGap + chartType.fontSize,
    ),
    highlight:
      points.length > 0
        ? highlightBox(input.highlight, first, span, x, dayWidth, plot)
        : null,
    markers: placeMarkers(markerPoints, plot),
  };
}

/**
 * The boxed period: its days, half a day past each end, clipped to the
 * plot. On a chart of one date it is the whole plot when the period holds
 * that date and nothing otherwise.
 */
function highlightBox(
  period: LineChartLayoutInput['highlight'],
  first: number,
  span: number,
  x: (day: number) => number,
  dayWidth: number,
  plot: ChartPlot,
): LineChartLayout['highlight'] {
  if (!period) return null;
  if (span === 0 && (period.from > first || period.to < first)) return null;
  const from = Math.max(x(period.from) - dayWidth / 2, plot.left);
  const to = Math.min(x(period.to) + dayWidth / 2, plot.right);
  if (to < from) return null;
  return periodBox(from, to - from, plot, 0);
}
