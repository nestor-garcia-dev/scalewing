import { describe, expect, it } from 'vitest';

import {
  alignedChartScales,
  chartScale,
  extentThroughZero,
  niceStep,
  scaleShare,
} from './chart-scale.js';

/** The ticks a single scale has at most: four steps, one widened. */
const chartScaleTicksAtMost = 6;

describe('chart scale', () => {
  it('takes a round step that covers the span in four steps or fewer', () => {
    expect(niceStep(580, 4)).toBe(200);
    expect(niceStep(100, 4)).toBe(25);
    expect(niceStep(7, 4)).toBe(2);
    expect(niceStep(0.3, 4)).toBe(0.1);
    expect(niceStep(0, 4)).toBe(1);
  });

  it('stretches an extent to reach zero', () => {
    expect(extentThroughZero([3, 8])).toEqual({ min: 0, max: 8 });
    expect(extentThroughZero([-3, -8])).toEqual({ min: -8, max: 0 });
    expect(extentThroughZero([])).toEqual({ min: 0, max: 0 });
  });

  it('marks whole steps either side of zero', () => {
    expect(chartScale({ min: -60, max: 520 })).toEqual({
      min: -200,
      max: 600,
      step: 200,
      ticks: [-200, 0, 200, 400, 600],
    });
    expect(chartScale({ min: 0, max: 155 }).ticks).toEqual([
      0, 50, 100, 150, 200,
    ]);
    expect(chartScale({ min: -8, max: 0 }).ticks).toEqual([-8, -6, -4, -2, 0]);
  });

  it('reads 0 to 1 when there is nothing but zero', () => {
    expect(chartScale({ min: 0, max: 0 })).toEqual({
      min: 0,
      max: 1,
      step: 1,
      ticks: [0, 1],
    });
  });

  it('widens the step once when rounding both sides would add a step', () => {
    // 4 steps of 25 would need -25..100 (five steps); 50 reads -50..100.
    const scale = chartScale({ min: -1, max: 99 });
    expect(scale.ticks.length).toBeLessThanOrEqual(chartScaleTicksAtMost);
    expect(scale.min).toBeLessThanOrEqual(-1);
    expect(scale.max).toBeGreaterThanOrEqual(99);
  });

  it('keeps very small steps within what a number can be written to', () => {
    expect(() => chartScale({ min: 0, max: 1e-120 })).not.toThrow();
  });

  it('keeps fractional steps free of floating-point dust', () => {
    expect(chartScale({ min: 0, max: 0.3 }).ticks).toEqual([0, 0.1, 0.2, 0.3]);
  });

  it('aligns two scales: zero and every grid line level, each its own step', () => {
    const [columns, line] = alignedChartScales(
      { min: -60, max: 520 },
      { min: -6, max: 64 },
    );
    // The board's −$200 to $800: the line needs four steps above zero.
    expect(columns.ticks).toEqual([-200, 0, 200, 400, 600, 800]);
    expect(line.ticks).toEqual([-20, 0, 20, 40, 60, 80]);
    expect(scaleShare(0, columns)).toBeCloseTo(scaleShare(0, line));
    expect(columns.ticks).toHaveLength(line.ticks.length);
  });

  it('gives both the larger side when they lean different ways', () => {
    const [up, down] = alignedChartScales(
      { min: 0, max: 100 },
      { min: -100, max: 0 },
    );
    expect(up.ticks).toEqual([-100, -50, 0, 50, 100]);
    expect(down.ticks).toEqual([-100, -50, 0, 50, 100]);
  });

  it('places a value as a share of the scale', () => {
    const scale = chartScale({ min: -60, max: 520 });
    expect(scaleShare(-200, scale)).toBe(0);
    expect(scaleShare(600, scale)).toBe(1);
    expect(scaleShare(0, scale)).toBe(0.25);
  });
});
