import {
  chartGap,
  chartInset,
  chartTextWidth,
  chartType,
} from './chart-metrics.js';

/**
 * A callout pinned above the plot: its words in a row at the top, beside a
 * dashed leader that runs down from the row to the column it is about.
 */
export type PlacedCallout = {
  /** Its place in the chart's `callouts`. */
  order: number;
  /** The category it is about. */
  index: number;
  text: string;
  /** The leader's x, the category's centre. */
  x: number;
  /** The words' start (or end) and baseline. */
  textX: number;
  textY: number;
  anchor: 'start' | 'end';
  /** The leader runs from the row (`leaderStart`) down to `leaderEnd`. */
  leaderStart: number;
  leaderEnd: number;
};

type Span = { from: number; to: number };

function overlaps(a: Span, b: Span): boolean {
  return a.from < b.to + chartGap && b.from < a.to + chartGap;
}

/**
 * Where a callout's words sit: after its leader in the first half of the
 * chart and before it in the second, the side with more room. Words
 * longer than that room are moved in so they stay inside the chart,
 * crossing their leader.
 */
export function besideLeader(
  x: number,
  width: number,
  bounds: { left: number; right: number },
): { anchor: 'start' | 'end'; textX: number } {
  if (x <= (bounds.left + bounds.right) / 2)
    return {
      anchor: 'start',
      textX: Math.max(
        bounds.left,
        Math.min(x + chartInset, bounds.right - width),
      ),
    };
  return {
    anchor: 'end',
    textX: Math.min(
      bounds.right,
      Math.max(x - chartInset, bounds.left + width),
    ),
  };
}

/**
 * Sets each callout's words beside its leader (`besideLeader`) and gives it the first row from
 * the top where it meets no other callout's words. Returns how many rows
 * the callouts take.
 */
export function calloutRows(
  callouts: readonly { index: number; text: string }[],
  centre: (index: number) => number,
  bounds: { left: number; right: number },
): { rows: number; callouts: PlacedCallout[] } {
  const rows: Span[][] = [];
  const placed = callouts.map((callout, order) => {
    const x = centre(callout.index);
    const width = chartTextWidth(callout.text);
    const { anchor, textX } = besideLeader(x, width, bounds);
    const span =
      anchor === 'start'
        ? { from: Math.min(x, textX), to: textX + width }
        : { from: textX - width, to: Math.max(x, textX) };
    let row = rows.findIndex((taken) => !taken.some((t) => overlaps(t, span)));
    if (row === -1) row = rows.push([]) - 1;
    rows[row]!.push(span);
    const rowTop = row * chartType.lineHeight;
    return {
      order,
      index: callout.index,
      text: callout.text,
      x,
      textX,
      textY: rowTop + chartType.fontSize,
      anchor,
      leaderStart: rowTop + chartType.lineHeight / 2,
      leaderEnd: rowTop + chartType.lineHeight / 2,
    };
  });
  return { rows: rows.length, callouts: placed };
}
