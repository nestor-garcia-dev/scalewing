import { describe, expect, it } from 'vitest';

import {
  wheelDragSettles,
  wheelEdgeRows,
  wheelIndexForOffset,
  wheelOffsetForIndex,
  wheelVisibleRows,
} from './wheel-geometry.js';

describe('wheel geometry', () => {
  it('centres the selected row among an odd number of visible rows', () => {
    expect(wheelVisibleRows % 2).toBe(1);
    expect(wheelEdgeRows()).toBe(2);
    expect(wheelOffsetForIndex(3, 44)).toBe(132);
  });

  it('rounds a settled offset to the nearest row and clamps to the list', () => {
    expect(wheelIndexForOffset(0, 44, 12)).toBe(0);
    expect(wheelIndexForOffset(21, 44, 12)).toBe(0);
    expect(wheelIndexForOffset(23, 44, 12)).toBe(1);
    expect(wheelIndexForOffset(132, 44, 12)).toBe(3);
    expect(wheelIndexForOffset(-30, 44, 12)).toBe(0);
    expect(wheelIndexForOffset(9999, 44, 12)).toBe(11);
    expect(wheelIndexForOffset(50, 44, 0)).toBe(0);
  });

  it('treats a drag without momentum as settled', () => {
    expect(wheelDragSettles(undefined)).toBe(true);
    expect(wheelDragSettles(0)).toBe(true);
    expect(wheelDragSettles(0.05)).toBe(true);
    expect(wheelDragSettles(1.2)).toBe(false);
    expect(wheelDragSettles(-0.8)).toBe(false);
  });
});
