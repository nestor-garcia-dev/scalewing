import { type CategoricalColor } from '@scalewing/tokens';

import {
  chartBoxRadius,
  chartColumnRadius,
  chartDotRadius,
} from '../../chart-metrics.js';
import { type ColumnChartLayout } from '../../column-chart-layout.js';
import { cx } from '../../class-names.js';
import { ChartValueAxis } from '../chart/ChartValueAxis.js';

export type ColumnChartDrawingProps = {
  layout: ColumnChartLayout;
  /** Each series' hue, in series order. */
  tones: readonly CategoricalColor[];
  /** Each callout's hue, in callout order. */
  calloutTones: readonly (CategoricalColor | undefined)[];
};

function toneClass(tone: CategoricalColor | undefined): string | undefined {
  return tone ? `sw-chart-tone-${tone}` : undefined;
}

/**
 * A column chart's picture, hidden from assistive technology (the table
 * beside it carries every figure): the grid and value axes, the boxed
 * period, the columns, the line and its last value, the category labels
 * and the callouts with their leaders. It is laid out in its own pixels,
 * left to right whatever the writing direction, as a time axis reads.
 */
export function ColumnChartDrawing({
  calloutTones,
  layout,
  tones,
}: ColumnChartDrawingProps) {
  const { plot } = layout;
  return (
    <svg
      aria-hidden="true"
      className="sw-chart-svg"
      direction="ltr"
      focusable="false"
      height={layout.height}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={layout.width}
    >
      <ChartValueAxis grid plot={plot} side="start" ticks={layout.ticks} />
      {layout.highlight ? (
        <rect
          className="sw-chart-highlight sw-chart-tone-accent"
          height={layout.highlight.height}
          rx={chartBoxRadius}
          width={layout.highlight.width}
          x={layout.highlight.x}
          y={layout.highlight.y}
        />
      ) : null}
      {layout.columns.map((column) => (
        <rect
          className={cx('sw-chart-column', toneClass(tones[column.series]))}
          height={column.height}
          key={`${column.series}-${column.category}`}
          rx={Math.min(chartColumnRadius, column.width / 2, column.height / 2)}
          width={column.width}
          x={column.x}
          y={column.y}
        />
      ))}
      {layout.line ? (
        <g className="sw-chart-tone-accent">
          <polyline
            className="sw-chart-line"
            points={layout.line.points.map((p) => `${p.x},${p.y}`).join(' ')}
          />
          <ChartValueAxis plot={plot} side="end" ticks={layout.lineTicks} />
          {layout.line.end || layout.line.points.length === 1 ? (
            // The last value's dot; a line of one point is only its dot.
            <circle
              className="sw-chart-dot"
              cx={layout.line.points.at(-1)!.x}
              cy={layout.line.points.at(-1)!.y}
              r={chartDotRadius}
            />
          ) : null}
          {layout.line.end ? (
            <text
              className="sw-chart-end-label"
              dominantBaseline="central"
              x={layout.line.end.x}
              y={layout.line.end.y}
            >
              {layout.line.end.text}
            </text>
          ) : null}
        </g>
      ) : null}
      {layout.categoryLabels.map((label) => (
        <text
          className="sw-chart-category"
          key={label.index}
          textAnchor="middle"
          x={label.x}
          y={label.y}
        >
          {label.text}
        </text>
      ))}
      {layout.callouts.map((callout) => (
        <g
          className={toneClass(calloutTones[callout.order])}
          key={callout.order}
        >
          <line
            className="sw-chart-leader"
            x1={callout.x}
            x2={callout.x}
            y1={callout.leaderStart}
            y2={callout.leaderEnd}
          />
          <text
            className="sw-chart-callout-text"
            textAnchor={callout.anchor}
            x={callout.textX}
            y={callout.textY}
          >
            {callout.text}
          </text>
        </g>
      ))}
    </svg>
  );
}
