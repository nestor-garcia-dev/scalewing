import { describe, expect, it } from 'vitest';

import { chartTextWidth } from './chart-metrics.js';
import { calloutRows } from './column-chart-callouts.js';

const centre = (index: number) => 50 + index * 100;
const bounds = { left: 0, right: 1000 };

describe('callout rows', () => {
  it('sets words after the leader in the first half and before it in the second', () => {
    const { rows, callouts } = calloutRows(
      [
        { index: 1, text: 'Roost found +50' },
        { index: 8, text: 'Colony arrived +52' },
      ],
      centre,
      bounds,
    );
    expect(rows).toBe(1);
    expect(callouts[0]).toMatchObject({
      order: 0,
      x: 150,
      textX: 154,
      anchor: 'start',
      textY: 13,
      leaderStart: 9,
    });
    expect(callouts[1]).toMatchObject({ x: 850, textX: 846, anchor: 'end' });
  });

  it('moves words longer than their side in, so they stay inside the chart', () => {
    // About 312 px of words on a 500 px chart.
    const text = 'A note about this week of the survey here';
    const width = chartTextWidth(text);
    expect(width).toBeGreaterThan(300);
    const at = (x: number) =>
      calloutRows([{ index: 0, text }], () => x, { left: 0, right: 500 })
        .callouts[0]!;
    // Room after the leader in the first half, and before it in the second.
    expect(at(100)).toMatchObject({ anchor: 'start', textX: 104 });
    expect(at(400)).toMatchObject({ anchor: 'end', textX: 396 });
    // Too long for its side: moved in to end at the edge.
    expect(at(240)).toMatchObject({ anchor: 'start', textX: 500 - width });
    expect(at(260)).toMatchObject({ anchor: 'end', textX: width });
    // Longer than the chart: it starts at the edge.
    const long = calloutRows([{ index: 0, text: text + text }], () => 100, {
      left: 0,
      right: 500,
    }).callouts[0]!;
    expect(long.textX).toBe(0);
  });

  it('gives callouts that would meet their own rows, top first', () => {
    const { rows, callouts } = calloutRows(
      [
        { index: 1, text: 'Roost found +50' },
        { index: 2, text: 'Flood +12' },
        { index: 7, text: 'Far away' },
      ],
      centre,
      bounds,
    );
    expect(rows).toBe(2);
    expect(callouts.map((c) => c.textY)).toEqual([13, 31, 13]);
    expect(callouts.map((c) => c.leaderStart)).toEqual([9, 27, 9]);
  });

  it('takes no rows without callouts', () => {
    expect(calloutRows([], centre, bounds)).toEqual({ rows: 0, callouts: [] });
  });
});
