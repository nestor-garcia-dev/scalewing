import { describe, expect, it } from 'vitest';

import { columnChartModes, columnSpans } from './column-chart-bars.js';

const herons = [3, -5, 0];
const egrets = [2, -1, 4];

describe('column spans', () => {
  it('lists the modes', () => {
    expect(columnChartModes).toEqual(['stacked', 'grouped']);
  });

  it('stacks positives up from zero and negatives down from it, in series order', () => {
    expect(columnSpans([herons, egrets], 3, 'stacked')).toEqual([
      { series: 0, category: 0, slot: 0, low: 0, high: 3 },
      { series: 1, category: 0, slot: 0, low: 3, high: 5 },
      { series: 0, category: 1, slot: 0, low: -5, high: 0 },
      { series: 1, category: 1, slot: 0, low: -6, high: -5 },
      // A zero value has no column; the next stacks from zero.
      { series: 1, category: 2, slot: 0, low: 0, high: 4 },
    ]);
  });

  it('sets each series in its own slot from zero when grouped', () => {
    expect(columnSpans([herons, egrets], 2, 'grouped')).toEqual([
      { series: 0, category: 0, slot: 0, low: 0, high: 3 },
      { series: 1, category: 0, slot: 1, low: 0, high: 2 },
      { series: 0, category: 1, slot: 0, low: -5, high: 0 },
      { series: 1, category: 1, slot: 1, low: -1, high: 0 },
    ]);
  });

  it('draws nothing without series or categories', () => {
    expect(columnSpans([], 3, 'stacked')).toEqual([]);
    expect(columnSpans([[]], 0, 'grouped')).toEqual([]);
  });
});
