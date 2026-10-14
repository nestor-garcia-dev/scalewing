'use client';

import { formatBarChartValue } from '@scalewing/tokens';
import {
  forwardRef,
  type HTMLAttributes,
  useImperativeHandle,
  useRef,
} from 'react';

import { cx } from '../class-names.js';
import {
  type ColumnChartMode,
  columnChartModes,
} from '../column-chart-bars.js';
import {
  assertColumnChartInput,
  type ColumnChartCallout,
  type ColumnChartLine,
  type ColumnChartSeries,
} from '../column-chart-input.js';
import { columnChartLayout } from '../column-chart-layout.js';
import { ChartTable } from './chart/ChartTable.js';
import { useChartWidth } from './chart/use-chart-width.js';
import { ChartCalloutList } from './column-chart/ChartCalloutList.js';
import { ColumnChartDrawing } from './column-chart/ColumnChartDrawing.js';

export type {
  ColumnChartCallout,
  ColumnChartLine,
  ColumnChartMode,
  ColumnChartSeries,
};
export { columnChartModes };

export type ColumnChartProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  /** Names the chart: the caption of the table that carries its figures. */
  label: string;
  /** The columns' places, such as weeks, in order; each is a row's header. */
  categories: readonly string[];
  /** Each series: a value per category, drawn in a categorical hue. */
  series: readonly ColumnChartSeries[];
  /**
   * `stacked` (the default) puts a category's columns on one another,
   * positive values up from zero and negative ones down from it;
   * `grouped` sets them side by side, each from zero.
   */
  mode?: ColumnChartMode;
  /** A line over the columns, such as a running total, on its own scale. */
  line?: ColumnChartLine;
  /** The index of the category to box, such as the current week. */
  highlight?: number;
  /** Words pinned above a category's column, with a leader down to it. */
  callouts?: readonly ColumnChartCallout[];
  /**
   * Writes each figure in the table and the line's last value, such as a
   * currency. Defaults to a plain number with at most one decimal.
   */
  formatValue?: (value: number) => string;
  /** Writes the axes' values, shorter if need be; defaults to `formatValue`. */
  formatTick?: (value: number) => string;
};

const noCallouts: readonly ColumnChartCallout[] = [];

/**
 * Columns for each category (a week, a month), stacked or grouped by
 * series, with an optional line on its own right-hand scale whose zero
 * and grid lines are level with the columns', the current period boxed
 * and callouts pinned above their columns. It fills its container's width
 * and is laid out for it: a narrow chart labels fewer categories and lists
 * its callouts under the plot, never scrolling sideways. The drawing is
 * hidden from assistive technology; a visually hidden table named by
 * `label` carries every figure, and the callouts stay a list. Put it on
 * the surface (a `Card`) with a `ChartLegend` above it naming each series
 * (`bar` in its tone), the line (`line`, `accent`) and the box (`box`,
 * `accent`). Input it cannot draw throws a `RangeError`.
 */
export const ColumnChart = forwardRef<HTMLDivElement, ColumnChartProps>(
  function ColumnChart(
    {
      callouts = noCallouts,
      categories,
      className,
      formatTick,
      formatValue = formatBarChartValue,
      highlight,
      label,
      line,
      mode = 'stacked',
      series,
      ...rest
    },
    ref,
  ) {
    assertColumnChartInput({
      label,
      categories,
      series,
      mode,
      line,
      highlight,
      callouts,
    });
    const box = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => box.current!, []);
    const width = useChartWidth(box);
    const lastLineValue = line?.values.at(-1);
    const layout = columnChartLayout({
      width,
      categories,
      series: series.map((s) => s.values),
      mode,
      line: line
        ? {
            values: line.values,
            endLabel:
              line.endLabel === false || lastLineValue === undefined
                ? null
                : formatValue(lastLineValue),
          }
        : null,
      highlight: highlight ?? null,
      callouts,
      formatTick: formatTick ?? formatValue,
    });

    return (
      <div ref={box} className={cx('sw-chart', className)} {...rest}>
        <ColumnChartDrawing
          calloutTones={callouts.map((callout) => callout.tone)}
          layout={layout}
          tones={series.map((s) => s.tone)}
        />
        <ChartTable
          caption={label}
          columns={[
            ...series.map((s) => s.label),
            ...(line ? [line.label] : []),
          ]}
          rows={categories.map((category, index) => ({
            key: `${category}-${index}`,
            header: category,
            cells: [
              ...series.map((s) => formatValue(s.values[index]!)),
              ...(line ? [formatValue(line.values[index]!)] : []),
            ],
            current: index === highlight,
          }))}
        />
        <ChartCalloutList callouts={callouts} visible={layout.compact} />
      </div>
    );
  },
);
