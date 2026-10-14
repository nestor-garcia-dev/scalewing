import { describe, expect, it } from 'vitest';

import {
  areaPath,
  lineChartCurves,
  linePath,
  svgPoints,
} from './line-chart-path.js';

const points = [
  { x: 0, y: 50 },
  { x: 10, y: 20 },
  { x: 30, y: 40 },
];

describe('line paths', () => {
  it('lists the curves', () => {
    expect(lineChartCurves).toEqual(['linear', 'step']);
  });

  it('joins points straight, or holds each value until the next date', () => {
    expect(linePath(points, 'linear')).toEqual(points);
    expect(linePath(points, 'step')).toEqual([
      { x: 0, y: 50 },
      { x: 10, y: 50 },
      { x: 10, y: 20 },
      { x: 30, y: 20 },
      { x: 30, y: 40 },
    ]);
    expect(linePath([], 'step')).toEqual([]);
  });

  it('closes the area along the zero line', () => {
    expect(areaPath(points, 60)).toEqual([
      { x: 0, y: 60 },
      ...points,
      { x: 30, y: 60 },
    ]);
    expect(areaPath([], 60)).toEqual([]);
  });

  it('writes vertices as SVG points', () => {
    expect(svgPoints(points)).toBe('0,50 10,20 30,40');
  });
});
