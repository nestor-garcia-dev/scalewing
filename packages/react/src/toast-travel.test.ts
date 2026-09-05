import { describe, expect, it } from 'vitest';

import { cssDurationMs, travelTranslate } from './toast-travel.js';

describe('cssDurationMs', () => {
  it('parses millisecond and second CSS durations', () => {
    expect(cssDurationMs('1200ms')).toBe(1200);
    expect(cssDurationMs('1.2s')).toBe(1200);
    expect(cssDurationMs('0s')).toBe(0);
    expect(cssDurationMs('1.2s, 0s')).toBe(1200);
  });
});

describe('travelTranslate', () => {
  it('centers the toast on the origin then the destination', () => {
    expect(
      travelTranslate(
        { left: 10, top: 20, width: 40, height: 20 },
        { left: 200, top: 80, width: 80, height: 20 },
        { left: 0, top: 0, width: 20, height: 10 },
      ),
    ).toEqual({
      fromX: 20,
      fromY: 25,
      toX: 230,
      toY: 85,
    });
  });
});
