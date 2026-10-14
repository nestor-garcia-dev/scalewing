import { describe, expect, it } from 'vitest';

import { chartTextWidth } from './chart-metrics.js';
import {
  lineChartLayout,
  type LineChartLayoutInput,
} from './line-chart-layout.js';

// Eleven days, 100 to 110, rising then falling.
const points = [3, 5, 8, 12, 9, 14, 18, 7, 9, 11, 10].map((y, i) => ({
  day: 100 + i,
  y: y * 1000,
}));

function input(overrides: Partial<LineChartLayoutInput> = {}) {
  return {
    width: 800,
    points,
    curve: 'linear',
    area: false,
    markers: [],
    ticks: [
      { day: 100, text: 'Day 100' },
      { day: 105, text: 'Day 105' },
      { day: 110, text: 'Day 110' },
    ],
    highlight: null,
    endLabel: '10,000',
    formatTick: (value: number) => `${value / 1000}k`,
    ...overrides,
  } satisfies LineChartLayoutInput;
}

describe('line chart layout', () => {
  it('spreads the dates across the plot and leaves room for the last value', () => {
    const layout = lineChartLayout(input());
    expect(layout.compact).toBe(false);
    expect(layout.plot.top).toBe(8 + 9);
    expect(layout.plot.bottom - layout.plot.top).toBe(192);
    expect(layout.path[0]!.x).toBe(layout.plot.left);
    expect(layout.path.at(-1)!.x).toBe(layout.plot.right);
    expect(layout.width - layout.plot.right).toBe(
      8 + Math.ceil(chartTextWidth('10,000')) + 8,
    );
    expect(layout.end).toEqual({
      x: layout.plot.right + 8,
      y: layout.last!.y,
      text: '10,000',
    });
    expect(layout.ticks.map((tick) => tick.label)).toEqual([
      '0k',
      '5k',
      '10k',
      '15k',
      '20k',
    ]);
  });

  it('steps, and fills the area down to zero', () => {
    const layout = lineChartLayout(input({ curve: 'step', area: true }));
    expect(layout.path).toHaveLength(points.length * 2 - 1);
    const zero = layout.ticks.find((tick) => tick.value === 0)!.y;
    expect(layout.area[0]).toEqual({ x: layout.plot.left, y: zero });
    expect(layout.area.at(-1)).toEqual({ x: layout.plot.right, y: zero });
    expect(lineChartLayout(input()).area).toEqual([]);
  });

  it('labels the asked-for dates, fewer when they would meet, ending on the last', () => {
    const wide = lineChartLayout(input());
    expect(wide.dateLabels.map((label) => label.text)).toEqual([
      'Day 100',
      'Day 105',
      'Day 110',
    ]);
    const narrow = lineChartLayout(input({ width: 200 }));
    expect(narrow.compact).toBe(true);
    expect(narrow.dateLabels.map((label) => label.text)).toEqual([
      'Day 100',
      'Day 110',
    ]);
    // Kept inside the chart's width.
    const last = narrow.dateLabels.at(-1)!;
    expect(last.x + chartTextWidth('Day 110') / 2).toBeLessThanOrEqual(200);
  });

  it('boxes a period half a day either side of its dates', () => {
    const layout = lineChartLayout(
      input({ highlight: { from: 107, to: 110 } }),
    );
    const day = (layout.plot.right - layout.plot.left) / 10;
    const from = layout.plot.left + day * 6.5;
    expect(layout.highlight!.x).toBeCloseTo(from);
    // Clipped at the plot's end.
    expect(layout.highlight!.x + layout.highlight!.width).toBeCloseTo(
      layout.plot.right,
    );
  });

  it("puts each marker on its day's last value", () => {
    const repeated = [...points.slice(0, 3), { day: 102, y: 2000 }];
    const layout = lineChartLayout(
      input({
        points: repeated,
        markers: [{ day: 102, label: 'Flock left' }],
        ticks: [],
      }),
    );
    const marker = layout.markers[0]!;
    expect(marker.x).toBe(layout.plot.right);
    const closing = layout.path.at(-1)!;
    expect(marker.triangle.split(' ')[0]).toBe(
      `${closing.x - 6},${closing.y + 4}`,
    );
  });

  it('draws one point in the middle and nothing for no points', () => {
    const one = lineChartLayout(
      input({
        points: [{ day: 5, y: 3 }],
        ticks: [],
        highlight: { from: 1, to: 9 },
      }),
    );
    // One date: the whole plot is its period, boxed only when it holds the date.
    expect(one.highlight!.width).toBe(one.plot.right - one.plot.left);
    expect(
      lineChartLayout(
        input({
          points: [{ day: 5, y: 3 }],
          ticks: [],
          highlight: { from: 6, to: 9 },
        }),
      ).highlight,
    ).toBeNull();
    expect(one.path).toEqual([
      { x: (one.plot.left + one.plot.right) / 2, y: expect.any(Number) },
    ]);
    const none = lineChartLayout(
      input({
        points: [],
        ticks: [],
        endLabel: null,
        highlight: { from: 1, to: 2 },
      }),
    );
    expect(none.path).toEqual([]);
    expect(none.last).toBeNull();
    expect(none.end).toBeNull();
    expect(none.highlight).toBeNull();
    expect(none.ticks.map((tick) => tick.value)).toEqual([0, 1]);
  });
});
