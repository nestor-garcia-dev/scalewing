'use client';

import { formatBarChartValue } from '@scalewing/tokens';
import {
  forwardRef,
  type HTMLAttributes,
  useImperativeHandle,
  useRef,
} from 'react';

import { cx } from '../class-names.js';
import { type ChartStrokeTone } from '../css/chart-tones.js';
import {
  assertLineChartInput,
  type LineChartMarker,
  type LineChartPeriod,
  type LineChartPoint,
  lineChartDay,
} from '../line-chart-input.js';
import { lineChartLayout } from '../line-chart-layout.js';
import { lineChartRows } from '../line-chart-table.js';
import { type LineChartCurve, lineChartCurves } from '../line-chart-path.js';
import { ChartTable } from './chart/ChartTable.js';
import { useChartWidth } from './chart/use-chart-width.js';
import { LineChartDrawing } from './line-chart/LineChartDrawing.js';

export type {
  LineChartCurve,
  LineChartMarker,
  LineChartPeriod,
  LineChartPoint,
};
export { lineChartCurves };

export type LineChartProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  /** Names the chart: the caption of the table that carries its figures. */
  label: string;
  /** Heads the table's value column; defaults to `label`. */
  valueLabel?: string;
  /** The values by date (`YYYY-MM-DD`), in date order. */
  points: readonly LineChartPoint[];
  /**
   * `linear` (the default) joins each point to the next; `step` holds a
   * value until the next date, as a balance that changes on a day does.
   */
  curve?: LineChartCurve;
  /** Fills the area between the line and zero with a tint of its tone. */
  area?: boolean;
  /** The line's stroke tone (default `accent`). */
  tone?: ChartStrokeTone;
  /** Downward triangles on the line at some of its dates, with words. */
  markers?: readonly LineChartMarker[];
  /** Heads the table's column of marker words; required with markers. */
  markersLabel?: string;
  /** The dates labelled on the time axis; the first and last by default. */
  ticks?: readonly string[];
  /** A period to box, such as the current week. */
  highlight?: LineChartPeriod;
  /** Writes the last value beside the plot's end (default `true`). */
  endLabel?: boolean;
  /** Writes each figure in the table and the last value. */
  formatValue?: (value: number) => string;
  /** Writes the value axis; defaults to `formatValue`. */
  formatTick?: (value: number) => string;
  /** Writes a date for the time axis and the table; the date itself by default. */
  formatDate?: (date: string) => string;
};

const none: readonly never[] = [];
const sameDate = (date: string) => date;

/**
 * A value over time: a line through its points by date, straight or in
 * steps, optionally over a tinted area, with markers on chosen dates, a
 * boxed period and its last value beside the plot. It fills its
 * container's width and is laid out for it, labelling fewer dates when
 * they would meet, never scrolling sideways. The drawing is hidden from
 * assistive technology; a visually hidden table named by `label` carries
 * every date, value and marker. Pair it with a `ChartLegend` (`line` in its
 * tone, `marker` in each marker's, `box` in `accent`), on the surface.
 * Input it cannot draw throws a `RangeError`.
 */
export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  function LineChart(
    {
      area = false,
      className,
      curve = 'linear',
      endLabel = true,
      formatDate = sameDate,
      formatTick,
      formatValue = formatBarChartValue,
      highlight,
      label,
      markers = none,
      markersLabel,
      points,
      ticks,
      tone = 'accent',
      valueLabel,
      ...rest
    },
    ref,
  ) {
    assertLineChartInput({
      label,
      valueLabel,
      points,
      curve,
      tone,
      markers,
      markersLabel,
      ticks,
      highlight,
    });
    const box = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => box.current!, []);
    const width = useChartWidth(box);
    const lastPoint = points.at(-1);
    const tickDates =
      ticks ??
      [...new Set([points[0]?.x, lastPoint?.x])].filter(
        (date): date is string => date !== undefined,
      );
    const layout = lineChartLayout({
      width,
      points: points.map((p) => ({ day: lineChartDay('x', p.x), y: p.y })),
      curve,
      area,
      markers: markers.map((m) => ({
        day: lineChartDay('x', m.x),
        label: m.label,
      })),
      ticks: tickDates.map((date) => ({
        day: lineChartDay('tick', date),
        text: formatDate(date),
      })),
      highlight: highlight
        ? {
            from: lineChartDay('from', highlight.from),
            to: lineChartDay('to', highlight.to),
          }
        : null,
      endLabel: endLabel && lastPoint ? formatValue(lastPoint.y) : null,
      formatTick: formatTick ?? formatValue,
    });

    return (
      <div ref={box} className={cx('sw-chart', className)} {...rest}>
        <LineChartDrawing
          layout={layout}
          markerTones={markers.map((m) => m.tone)}
          tone={tone}
        />
        <ChartTable
          caption={label}
          columns={[
            valueLabel ?? label,
            ...(markers.length > 0 ? [markersLabel!] : []),
          ]}
          rows={lineChartRows({
            formatDate,
            formatValue,
            highlight,
            markers,
            points,
          })}
        />
      </div>
    );
  },
);
