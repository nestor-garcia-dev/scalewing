import { chartBoxRadius, chartDotRadius } from '../../chart-metrics.js';
import { type ChartStrokeTone } from '../../css/chart-tones.js';
import { type LineChartLayout } from '../../line-chart-layout.js';
import { svgPoints } from '../../line-chart-path.js';
import { ChartValueAxis } from '../chart/ChartValueAxis.js';

export type LineChartDrawingProps = {
  layout: LineChartLayout;
  tone: ChartStrokeTone;
  /** Each marker's tone, in marker order. */
  markerTones: readonly ChartStrokeTone[];
};

/**
 * A line chart's picture, hidden from assistive technology (the table
 * beside it carries every figure): the grid and value axis, the boxed
 * period, the area and line in the line's tone with a dot and words at its
 * last value, the date labels, and each marker's triangle and words in its
 * own tone. It is laid out in its own pixels, left to right whatever the
 * writing direction, as a time axis reads.
 */
export function LineChartDrawing({
  layout,
  markerTones,
  tone,
}: LineChartDrawingProps) {
  const { last, plot } = layout;
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
      <g className={`sw-chart-tone-${tone}`}>
        {layout.area.length > 0 ? (
          <polygon className="sw-chart-area" points={svgPoints(layout.area)} />
        ) : null}
        <polyline className="sw-chart-line" points={svgPoints(layout.path)} />
        {last && (layout.end || layout.path.length === 1) ? (
          // The last value's dot; a line of one point is only its dot.
          <circle
            className="sw-chart-dot"
            cx={last.x}
            cy={last.y}
            r={chartDotRadius}
          />
        ) : null}
        {layout.end ? (
          <text
            className="sw-chart-end-label"
            dominantBaseline="central"
            x={layout.end.x}
            y={layout.end.y}
          >
            {layout.end.text}
          </text>
        ) : null}
      </g>
      {layout.markers.map((marker) => (
        <g
          className={`sw-chart-tone-${markerTones[marker.order]}`}
          key={marker.order}
        >
          <polygon className="sw-chart-marker" points={marker.triangle} />
          {marker.labelShown ? (
            <text
              className="sw-chart-marker-label"
              textAnchor="middle"
              x={marker.labelX}
              y={marker.labelY}
            >
              {marker.label}
            </text>
          ) : null}
        </g>
      ))}
      {layout.dateLabels.map((label) => (
        <text
          className="sw-chart-category"
          key={label.day}
          textAnchor="middle"
          x={label.x}
          y={label.y}
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}
