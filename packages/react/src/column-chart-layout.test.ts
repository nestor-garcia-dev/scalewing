import { describe, expect, it } from 'vitest';

import { chartTextWidth } from './chart-metrics.js';
import {
  columnChartLayout,
  type ColumnChartLayoutInput,
} from './column-chart-layout.js';

const weeks = Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`);
const herons = [3, -5, -4, 1, -8, -5, 2, -5, -1, 2, -3, 52, -1];
const egrets = [0, 3, -3, 50, 0, -3, 0, -4, 0, 0, 0, -8, 0];
const total = herons.map((_, i) =>
  herons.slice(0, i + 1).reduce((sum, h, j) => sum + h + egrets[j]!, 0),
);

function input(overrides: Partial<ColumnChartLayoutInput> = {}) {
  return {
    width: 1000,
    categories: weeks,
    series: [herons, egrets],
    mode: 'stacked',
    line: { values: total, endLabel: '+63' },
    highlight: 12,
    callouts: [
      { index: 3, text: 'Roost found +50' },
      { index: 11, text: 'Colony arrived +52' },
    ],
    formatTick: String,
    ...overrides,
  } satisfies ColumnChartLayoutInput;
}

describe('column chart layout', () => {
  it('pins the callouts in a row above the plot and draws them on a wide chart', () => {
    const layout = columnChartLayout(input());
    expect(layout.compact).toBe(false);
    // One row of callouts (18), a gap (8) and half a line for the top tick.
    expect(layout.plot.top).toBe(18 + 8 + 9);
    expect(layout.plot.bottom - layout.plot.top).toBe(192);
    expect(layout.height).toBe(layout.plot.bottom + 8 + 18);
    expect(layout.callouts.map((c) => c.anchor)).toEqual(['start', 'end']);
    // Each leader runs from its row down to just above its tallest column.
    const roost = layout.callouts[0]!;
    const roostTop = Math.min(
      ...layout.columns.filter((c) => c.category === 3).map((c) => c.y),
    );
    expect(roost.leaderStart).toBe(9);
    expect(roost.leaderEnd).toBeCloseTo(roostTop - 4);
  });

  it('levels zero on both scales, and writes the last value beside the line axis', () => {
    const layout = columnChartLayout(input());
    const zero = layout.ticks.find((t) => t.value === 0)!;
    expect(layout.ticks.map((t) => t.value)).toEqual([-20, 0, 20, 40, 60, 80]);
    expect(layout.line!.end).toEqual({
      x: layout.plot.right + 8,
      y: layout.line!.points.at(-1)!.y,
      text: '+63',
    });
    // The line axis's 60 would meet "+63", so it is dropped.
    expect(layout.lineTicks.map((t) => t.value)).toEqual([-20, 0, 20, 40, 80]);
    expect(layout.lineTicks.find((t) => t.value === 0)!.y).toBe(zero.y);
    // The right gutter holds the widest of the axis words and the end label.
    expect(layout.width - layout.plot.right).toBe(
      8 + Math.ceil(chartTextWidth('+63')) + 8,
    );
  });

  it('stacks the columns on zero, at least 1 px tall, centred in their category', () => {
    const layout = columnChartLayout(input());
    const band = (layout.plot.right - layout.plot.left) / 13;
    const zeroY = layout.ticks.find((t) => t.value === 0)!.y;
    const week1 = layout.columns.filter((c) => c.category === 0);
    expect(week1).toHaveLength(1);
    expect(week1[0]!.y + week1[0]!.height).toBeCloseTo(zeroY);
    expect(week1[0]!.width).toBeCloseTo(band * 0.6);
    expect(week1[0]!.x + week1[0]!.width / 2).toBeCloseTo(
      layout.plot.left + band / 2,
    );
    // Week 2: herons −5 hang from zero, egrets +3 stand on it.
    const [down, up] = layout.columns.filter((c) => c.category === 1);
    expect(down!.y).toBeCloseTo(zeroY);
    expect(up!.y + up!.height).toBeCloseTo(zeroY);
    const tiny = columnChartLayout(
      input({ series: [[0.001, ...herons.slice(1)]], line: null }),
    ).columns[0]!;
    expect(tiny.height).toBe(1);
  });

  it('sets grouped columns side by side, each from zero', () => {
    const layout = columnChartLayout(input({ mode: 'grouped', line: null }));
    const [heron, egret] = layout.columns.filter((c) => c.category === 3);
    expect(egret!.x).toBeGreaterThan(heron!.x + heron!.width);
    expect(layout.width - layout.plot.right).toBe(8);
    expect(layout.lineTicks).toEqual([]);
    expect(layout.line).toBeNull();
  });

  it('boxes the highlighted category across the plot', () => {
    const layout = columnChartLayout(input());
    const band = (layout.plot.right - layout.plot.left) / 13;
    expect(layout.highlight).toEqual({
      x: layout.plot.left + band * 12 + 2,
      y: layout.plot.top - 8,
      width: band - 4,
      height: 192 + 8 + 4,
    });
    expect(columnChartLayout(input({ highlight: null })).highlight).toBeNull();
  });

  it('is compact at a phone width: shorter, fewer labels, no callouts drawn', () => {
    const layout = columnChartLayout(input({ width: 330 }));
    expect(layout.compact).toBe(true);
    expect(layout.callouts).toEqual([]);
    expect(layout.plot.top).toBe(8 + 9);
    expect(layout.plot.bottom - layout.plot.top).toBe(160);
    expect(layout.categoryLabels.length).toBeLessThan(13);
    expect(layout.categoryLabels.at(-1)!.text).toBe('Week 13');
    // The last label is moved in so its words end inside the chart.
    const grouped = columnChartLayout(
      input({ width: 330, mode: 'grouped', line: null }),
    );
    const last = grouped.categoryLabels.at(-1)!;
    expect(last.x + chartTextWidth('Week 13') / 2).toBeLessThanOrEqual(330);
    // Nothing is drawn past the chart's width.
    expect(layout.line!.end!.x + chartTextWidth('+63')).toBeLessThanOrEqual(
      330,
    );
  });

  it('keeps the boxed period a hairline wide on a chart denser than its inset', () => {
    const days = Array.from({ length: 365 }, (_, i) => `Day ${i + 1}`);
    const layout = columnChartLayout(
      input({
        width: 330,
        categories: days,
        series: [days.map(() => 1)],
        line: null,
        highlight: 364,
        callouts: [],
      }),
    );
    expect(layout.highlight!.width).toBe(1);
    const band = (layout.plot.right - layout.plot.left) / 365;
    expect(layout.highlight!.x + 0.5).toBeCloseTo(
      layout.plot.left + band * 364.5,
    );
  });

  it("gives up the line axis's words when they would leave too narrow a plot", () => {
    const layout = columnChartLayout(input({ width: 150, callouts: [] }));
    expect(layout.lineTicks).toEqual([]);
    expect(layout.line!.end).not.toBeNull();
    expect(layout.plot.right - layout.plot.left).toBeGreaterThan(0);
    expect(columnChartLayout(input({ width: 330 })).lineTicks).not.toEqual([]);
  });

  it('draws an empty chart as a 0 to 1 axis with nothing on it', () => {
    const layout = columnChartLayout(
      input({
        categories: [],
        series: [],
        line: null,
        highlight: null,
        callouts: [],
      }),
    );
    expect(layout.ticks.map((t) => t.value)).toEqual([0, 1]);
    expect(layout.columns).toEqual([]);
    expect(layout.categoryLabels).toEqual([]);
    expect(layout.highlight).toBeNull();
  });
});
