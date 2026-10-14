import { describe, expect, it } from 'vitest';

import { chartTextWidth } from './chart-metrics.js';
import { placeMarkers } from './line-chart-markers.js';

const plot = { left: 40, right: 600, top: 17, bottom: 209 };

describe('line chart markers', () => {
  it('hangs a downward triangle under the line with its words below', () => {
    const [marker] = placeMarkers([{ x: 100, y: 80, label: '2600' }], plot);
    // 12 px wide and tall, an inset under the line, the tip at the bottom.
    expect(marker!.triangle).toBe('94,84 106,84 100,96');
    expect(marker!.labelY).toBe(96 + 13);
    expect(marker!.labelShown).toBe(true);
  });

  it('sets both above the line when the words would pass the plot bottom', () => {
    const [marker] = placeMarkers([{ x: 100, y: 200, label: '700' }], plot);
    expect(marker!.triangle).toBe('94,184 106,184 100,196');
    expect(marker!.labelY).toBe(184 - 5);
  });

  it('moves words in so they stay over the plot, clear of the axis words and the last value', () => {
    const [first, last] = placeMarkers(
      [
        { x: 47, y: 80, label: 'Flock of 3800' },
        { x: 580, y: 80, label: 'Flock of 3800' },
      ],
      plot,
    );
    const half = chartTextWidth('Flock of 3800') / 2;
    expect(first!.labelX).toBe(plot.left + half);
    expect(last!.labelX).toBe(plot.right - half);
    // The triangle stays on its date.
    expect(first!.triangle.split(' ')[2]).toBe('47,96');
    const wide = placeMarkers(
      [{ x: 50, y: 80, label: 'x'.repeat(200) }],
      plot,
    )[0]!;
    expect(wide.labelX).toBe((plot.left + plot.right) / 2);
  });

  it("leaves out words that would meet an earlier marker's", () => {
    const placed = placeMarkers(
      [
        { x: 100, y: 80, label: '1000' },
        { x: 120, y: 82, label: '700' },
        { x: 200, y: 80, label: '900' },
      ],
      plot,
    );
    expect(placed.map((m) => m.labelShown)).toEqual([true, false, true]);
    expect(placed.map((m) => m.order)).toEqual([0, 1, 2]);
  });
});
