import { describe, expect, it } from 'vitest';

import {
  endGutter,
  labelGutter,
  labelledPlaces,
  ticksClearOf,
  valueTicks,
  valueY,
} from './chart-axis.js';
import { chartTextWidth } from './chart-metrics.js';
import { chartScale } from './chart-scale.js';

const plot = { left: 40, right: 400, top: 10, bottom: 210 };

describe('chart axis', () => {
  it('places values from the plot bottom up', () => {
    const scale = chartScale({ min: -50, max: 150 });
    expect(valueY(scale.min, scale, plot)).toBe(210);
    expect(valueY(scale.max, scale, plot)).toBe(10);
    expect(valueTicks(scale, plot, (v) => `${v} birds`)).toEqual([
      { value: -50, y: 210, label: '-50 birds' },
      { value: 0, y: 160, label: '0 birds' },
      { value: 50, y: 110, label: '50 birds' },
      { value: 100, y: 60, label: '100 birds' },
      { value: 150, y: 10, label: '150 birds' },
    ]);
  });

  it('leaves room for the widest label and a gap', () => {
    expect(labelGutter(['0', '−$200', '$800'])).toBe(
      Math.ceil(chartTextWidth('−$200')) + 8,
    );
    expect(labelGutter([])).toBe(8);
  });

  it('labels every place when the labels fit, and fewer from the last back when not', () => {
    const weeks = Array.from({ length: 13 }, (_, i) => `Wk ${i + 1}`);
    expect(labelledPlaces(weeks, 80)).toHaveLength(13);
    // "Wk 13" is about 39 px; with a gap either side it needs 55 px.
    expect(labelledPlaces(weeks, 30)).toEqual([0, 2, 4, 6, 8, 10, 12]);
    expect(labelledPlaces(weeks, 16)).toEqual([0, 4, 8, 12]);
    expect(labelledPlaces(weeks.slice(0, 12), 16)).toEqual([3, 7, 11]);
    expect(labelledPlaces([], 16)).toEqual([]);
  });

  it('drops the ticks that would meet a label beside the axis', () => {
    const ticks = [
      { value: 0, y: 100, label: '0' },
      { value: 20, y: 80, label: '20' },
      { value: 40, y: 60, label: '40' },
    ];
    expect(ticksClearOf(ticks, 70)).toEqual([ticks[0]]);
  });

  it('leaves room past the plot for a line axis and its last value', () => {
    const words = ['0', '20', '40'];
    const wide = endGutter({
      width: 600,
      left: 40,
      axisWords: words,
      endLabel: '+63',
    });
    expect(wide).toEqual({
      gutter: 8 + Math.ceil(chartTextWidth('+63')) + 8,
      axisWordsShown: true,
    });
    // Too narrow: the axis words give way, the last value stays.
    expect(
      endGutter({ width: 150, left: 40, axisWords: words, endLabel: '+63' }),
    ).toEqual({
      gutter: 8 + Math.ceil(chartTextWidth('+63')) + 8,
      axisWordsShown: false,
    });
    expect(
      endGutter({ width: 600, left: 40, axisWords: [], endLabel: null }),
    ).toEqual({ gutter: 8, axisWordsShown: false });
  });
});
