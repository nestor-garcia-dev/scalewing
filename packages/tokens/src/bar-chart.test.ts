import { describe, expect, it } from 'vitest';

import {
  barChartFillRatio,
  barChartScaleMax,
  formatBarChartValue,
} from './bar-chart.js';

describe('barChartScaleMax', () => {
  it('uses the largest absolute value, or 1 when every value is 0', () => {
    expect(barChartScaleMax([1, 3, -2])).toBe(3);
    expect(barChartScaleMax([0, 0])).toBe(1);
  });

  it('keeps an explicit positive max so charts can share a scale', () => {
    expect(barChartScaleMax([1, 5.8], 6)).toBe(6);
    expect(barChartScaleMax([1], 0)).toBe(1);
  });
});

describe('barChartFillRatio', () => {
  it('maps magnitude onto the scale and clamps overflow', () => {
    expect(barChartFillRatio(3, 6)).toBe(0.5);
    expect(barChartFillRatio(-3, 6)).toBe(0.5);
    expect(barChartFillRatio(8, 6)).toBe(1);
    expect(barChartFillRatio(2, 0)).toBe(0);
  });
});

describe('formatBarChartValue', () => {
  it('prints one decimal when needed and treats tiny values as 0', () => {
    expect(formatBarChartValue(5.8)).toBe('5.8');
    expect(formatBarChartValue(5)).toBe('5');
    expect(formatBarChartValue(-1.5)).toBe('-1.5');
    expect(formatBarChartValue(0.04)).toBe('0');
  });
});
