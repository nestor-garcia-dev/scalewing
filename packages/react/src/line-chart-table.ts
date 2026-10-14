import { type ChartTableRow } from './chart-table-rows.js';
import {
  type LineChartMarker,
  type LineChartPeriod,
  type LineChartPoint,
} from './line-chart-input.js';
import { closingIndexes } from './line-chart-points.js';

/**
 * A line chart's hidden table rows: one per point, headed by its date in
 * the consumer's words, holding its value and (when the chart has markers)
 * the words of the markers on its date, in the date's closing row only;
 * the rows inside the boxed period are current.
 */
export function lineChartRows({
  formatDate,
  formatValue,
  highlight,
  markers,
  points,
}: {
  points: readonly LineChartPoint[];
  markers: readonly LineChartMarker[];
  highlight: LineChartPeriod | undefined;
  formatDate: (date: string) => string;
  formatValue: (value: number) => string;
}): ChartTableRow[] {
  const closing = closingIndexes(points.map((point) => point.x));
  return points.map((point, index) => {
    const cells = [formatValue(point.y)];
    if (markers.length > 0)
      cells.push(
        closing.get(point.x) === index
          ? markers
              .filter((marker) => marker.x === point.x)
              .map((marker) => marker.label)
              .join(', ')
          : '',
      );
    return {
      key: `${point.x}-${index}`,
      header: formatDate(point.x),
      cells,
      // YYYY-MM-DD dates compare in date order as text.
      current:
        highlight !== undefined &&
        point.x >= highlight.from &&
        point.x <= highlight.to,
    };
  });
}
