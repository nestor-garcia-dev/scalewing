import { type ChartPlot, type ChartTick } from '../../chart-axis.js';
import { chartGap } from '../../chart-metrics.js';
import { cx } from '../../class-names.js';

export type ChartValueAxisProps = {
  plot: ChartPlot;
  ticks: readonly ChartTick[];
  /** The side its words sit on: the plot's start, or its end for a line's own scale. */
  side: 'start' | 'end';
  /** Draws the grid lines across the plot (the start axis does). */
  grid?: boolean;
};

/**
 * A value axis inside a chart's SVG: a grid line at each tick across the
 * plot, the zero line set apart, and each tick's words beside the plot.
 */
export function ChartValueAxis({
  grid = false,
  plot,
  side,
  ticks,
}: ChartValueAxisProps) {
  const x = side === 'start' ? plot.left - chartGap : plot.right + chartGap;
  return (
    <g>
      {ticks.map((tick) => (
        <g key={tick.value}>
          {grid ? (
            <line
              className={tick.value === 0 ? 'sw-chart-zero' : 'sw-chart-grid'}
              x1={plot.left}
              x2={plot.right}
              y1={tick.y}
              y2={tick.y}
            />
          ) : null}
          <text
            className={cx(
              'sw-chart-tick',
              side === 'end' && 'sw-chart-tick-line',
            )}
            dominantBaseline="central"
            textAnchor={side === 'start' ? 'end' : 'start'}
            x={x}
            y={tick.y}
          >
            {tick.label}
          </text>
        </g>
      ))}
    </g>
  );
}
