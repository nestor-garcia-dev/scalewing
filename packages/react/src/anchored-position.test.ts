import { describe, expect, it } from 'vitest';

import { anchoredPosition } from './anchored-position.js';

const viewport = { width: 390, height: 844 };
const size = { width: 334, height: 420 };

describe('anchored popover position', () => {
  it('opens below the anchor, aligned to its start', () => {
    expect(
      anchoredPosition(
        { top: 100, bottom: 144, left: 16, right: 200 },
        size,
        viewport,
        { gap: 4, inset: 8 },
      ),
    ).toEqual({ left: 16, top: 148 });
  });

  it('stays inside a phone-width viewport', () => {
    expect(
      anchoredPosition(
        { top: 100, bottom: 144, left: 200, right: 380 },
        size,
        viewport,
        { inset: 8 },
      ).left,
    ).toBe(48);
    expect(
      anchoredPosition(
        { top: 100, bottom: 144, left: -40, right: 100 },
        size,
        viewport,
        { inset: 8 },
      ).left,
    ).toBe(8);
  });

  it('flips above when only the space above fits', () => {
    expect(
      anchoredPosition(
        { top: 700, bottom: 744, left: 16, right: 200 },
        size,
        viewport,
        { gap: 4, inset: 8 },
      ).top,
    ).toBe(276);
  });

  it('aligns to the anchor end in right-to-left text', () => {
    expect(
      anchoredPosition(
        { top: 100, bottom: 144, left: 40, right: 374 },
        size,
        viewport,
        { rtl: true },
      ).left,
    ).toBe(40);
  });

  it('keeps an oversized popover on screen', () => {
    expect(
      anchoredPosition(
        { top: 300, bottom: 344, left: 16, right: 200 },
        { width: 334, height: 600 },
        { width: 390, height: 700 },
        { inset: 8 },
      ).top,
    ).toBe(92);
  });
});
