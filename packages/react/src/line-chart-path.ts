/** How a line runs between its points. */
export const lineChartCurves = ['linear', 'step'] as const;

export type LineChartCurve = (typeof lineChartCurves)[number];

/** A point in the chart's pixels. */
export type ChartPoint = { x: number; y: number };

/**
 * The vertices a line is drawn through. `linear` joins each point to the
 * next; `step` holds each value until the next point's date, then moves
 * straight up or down to it, as a balance that changes on a day does.
 */
export function linePath(
  points: readonly ChartPoint[],
  curve: LineChartCurve,
): ChartPoint[] {
  if (curve === 'linear') return [...points];
  const path: ChartPoint[] = [];
  points.forEach((point, index) => {
    const previous = points[index - 1];
    if (previous) path.push({ x: point.x, y: previous.y });
    path.push(point);
  });
  return path;
}

/** The area under a line's path, closed along the zero line. */
export function areaPath(
  path: readonly ChartPoint[],
  zeroY: number,
): ChartPoint[] {
  if (path.length === 0) return [];
  return [
    { x: path[0]!.x, y: zeroY },
    ...path,
    { x: path.at(-1)!.x, y: zeroY },
  ];
}

/** Vertices as an SVG `points` list. */
export function svgPoints(path: readonly ChartPoint[]): string {
  return path.map((point) => `${point.x},${point.y}`).join(' ');
}
