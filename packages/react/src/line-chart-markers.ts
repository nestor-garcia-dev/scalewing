import { type ChartPlot } from './chart-axis.js';
import {
  chartInset,
  chartMarkerSize,
  chartTextWidth,
  chartType,
} from './chart-metrics.js';

/**
 * A marker on a line: a downward triangle at its date with its words,
 * below the line where they fit inside the plot, above it otherwise. Its
 * words are left out where they would meet an earlier marker's.
 */
export type PlacedMarker = {
  /** Its place in the chart's `markers`. */
  order: number;
  x: number;
  /** The triangle's corners, as SVG points. */
  triangle: string;
  /** Its words' centre, moved in so they stay over the plot. */
  labelX: number;
  labelY: number;
  label: string;
  labelShown: boolean;
};

type Box = { left: number; right: number; top: number; bottom: number };

function meets(a: Box, b: Box): boolean {
  return (
    a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  );
}

/**
 * A centre for words `width` wide that keeps them over the plot, clear of
 * the value axis's words and the last value beside it; centred on the plot
 * when they are wider than it.
 */
function overPlot(x: number, width: number, plot: ChartPlot): number {
  const low = plot.left + width / 2;
  const high = plot.right - width / 2;
  if (low > high) return (plot.left + plot.right) / 2;
  return Math.min(Math.max(x, low), high);
}

/**
 * Places each marker at the line's height on its date: the triangle a
 * small inset under the line, its words under it (moved in to stay over
 * the plot), or both above the line when the words would pass the plot's
 * bottom.
 */
export function placeMarkers(
  markers: readonly { x: number; y: number; label: string }[],
  plot: ChartPlot,
): PlacedMarker[] {
  const half = chartMarkerSize / 2;
  const shown: Box[] = [];
  return markers.map((marker, order) => {
    const below =
      marker.y + chartInset + chartMarkerSize + chartType.lineHeight <=
      plot.bottom;
    const top = below
      ? marker.y + chartInset
      : marker.y - chartInset - chartMarkerSize;
    const bottom = top + chartMarkerSize;
    const labelY = below
      ? bottom + chartType.fontSize
      : top - (chartType.lineHeight - chartType.fontSize);
    const width = chartTextWidth(marker.label);
    const labelX = overPlot(marker.x, width, plot);
    const box = {
      left: labelX - width / 2,
      right: labelX + width / 2,
      top: labelY - chartType.fontSize,
      bottom: labelY + (chartType.lineHeight - chartType.fontSize),
    };
    const labelShown = !shown.some((taken) => meets(taken, box));
    if (labelShown) shown.push(box);
    return {
      order,
      x: marker.x,
      labelX,
      triangle: `${marker.x - half},${top} ${marker.x + half},${top} ${marker.x},${bottom}`,
      labelY,
      label: marker.label,
      labelShown,
    };
  });
}
