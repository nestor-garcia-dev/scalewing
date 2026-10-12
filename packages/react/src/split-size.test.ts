import { describe, expect, it } from 'vitest';

import {
  applySplitDrag,
  applySplitKey,
  clampSplitSize,
  cssLengthToPx,
  effectiveSplitRange,
  readSplitMetrics,
  splitPercent,
} from './split-size.js';

const metrics = { min: 100, max: 400, step: 16 };

describe('split-size', () => {
  it('parses rem and px lengths', () => {
    expect(cssLengthToPx('14rem')).toBe(224);
    expect(cssLengthToPx('32px')).toBe(32);
    expect(cssLengthToPx(' 22rem ', 10)).toBe(220);
  });

  it('reads token fallbacks when the stylesheet is absent', () => {
    const values = readSplitMetrics(() => '');
    expect(values.min).toBe(224);
    expect(values.defaultWidth).toBe(352);
    expect(values.max).toBe(512);
    expect(values.step).toBe(16);
  });

  it('clamps and reports percent between min and max', () => {
    expect(clampSplitSize(50, 100, 400)).toBe(100);
    expect(clampSplitSize(500, 100, 400)).toBe(400);
    expect(splitPercent(100, 100, 400)).toBe(0);
    expect(splitPercent(250, 100, 400)).toBe(50);
    expect(splitPercent(400, 100, 400)).toBe(100);
    // No range left: the pane is as wide as it can be.
    expect(splitPercent(106, 106, 106)).toBe(100);
  });

  it('keeps room for a sibling pane when the parent is narrow', () => {
    const tokens = { min: 224, max: 512 };
    expect(effectiveSplitRange(tokens, 800, 28)).toEqual({
      min: 224,
      max: 512,
    });
    expect(effectiveSplitRange(tokens, 600, 28)).toEqual({
      min: 224,
      max: 348,
    });
    // A phone: the room after the handle and the next column's 14rem is under
    // the minimum, so the range narrows to that room (the stylesheet's cap).
    expect(effectiveSplitRange(tokens, 358, 28)).toEqual({
      min: 106,
      max: 106,
    });
    expect(effectiveSplitRange(tokens, 200, 28)).toEqual({ min: 0, max: 0 });
    // Not laid out: the token range.
    expect(effectiveSplitRange(tokens, 0, 28)).toEqual({ min: 224, max: 512 });
  });

  it('collapses when dragged below min and restores from a collapsed drag', () => {
    expect(
      applySplitDrag({ collapsed: false, width: 200 }, -150, metrics),
    ).toEqual({ collapsed: true, width: 200 });
    expect(
      applySplitDrag({ collapsed: true, width: 200 }, 20, metrics),
    ).toEqual({ collapsed: false, width: 120 });
    expect(applySplitDrag({ collapsed: true, width: 200 }, 0, metrics)).toEqual(
      { collapsed: true, width: 200 },
    );
  });

  it('maps separator keys to size and collapse', () => {
    expect(
      applySplitKey('ArrowLeft', { collapsed: false, width: 110 }, metrics),
    ).toEqual({ collapsed: true, width: 110 });
    expect(
      applySplitKey('ArrowRight', { collapsed: true, width: 200 }, metrics),
    ).toEqual({ collapsed: false, width: 200 });
    expect(
      applySplitKey('Enter', { collapsed: false, width: 200 }, metrics),
    ).toEqual({ collapsed: true, width: 200 });
    expect(
      applySplitKey('Home', { collapsed: false, width: 200 }, metrics),
    ).toEqual({ collapsed: false, width: 100 });
    expect(
      applySplitKey('Tab', { collapsed: false, width: 200 }, metrics),
    ).toBe(null);
  });

  it('never collapses a narrowed pane on a move to the end', () => {
    const narrow = { min: 106, max: 106, step: 16 };
    const start = { collapsed: false, width: 106 };
    expect(applySplitDrag(start, 10, narrow)).toEqual(start);
    expect(applySplitDrag(start, -10, narrow)).toEqual({
      collapsed: true,
      width: 106,
    });
    expect(applySplitKey('ArrowRight', start, narrow)).toEqual(start);
    expect(applySplitKey('ArrowLeft', start, narrow)).toEqual({
      collapsed: true,
      width: 106,
    });
  });
});
