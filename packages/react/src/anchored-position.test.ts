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

  describe('flipInline', () => {
    const menu = { width: 160, height: 120 };
    const phone = { width: 390, height: 844 };

    it('keeps a menu that fits aligned to the trigger start', () => {
      expect(
        anchoredPosition(
          { top: 100, bottom: 128, left: 16, right: 53 },
          menu,
          phone,
          { gap: 4, inset: 8, flipInline: true },
        ),
      ).toEqual({ left: 16, top: 132 });
    });

    it('lines a menu up with the end of a trigger at the row end', () => {
      expect(
        anchoredPosition(
          { top: 100, bottom: 128, left: 337, right: 374 },
          menu,
          phone,
          { gap: 4, inset: 8, flipInline: true },
        ),
      ).toEqual({ left: 214, top: 132 });
      // Without the flip it would only be clamped to the inset.
      expect(
        anchoredPosition(
          { top: 100, bottom: 128, left: 337, right: 374 },
          menu,
          phone,
          { gap: 4, inset: 8 },
        ).left,
      ).toBe(222);
    });

    it('clamps to the inset when neither alignment fits', () => {
      expect(
        anchoredPosition(
          { top: 100, bottom: 128, left: 100, right: 140 },
          { width: 360, height: 120 },
          phone,
          { inset: 8, flipInline: true },
        ).left,
      ).toBe(22);
    });

    it('mirrors in right-to-left text', () => {
      expect(
        anchoredPosition(
          { top: 100, bottom: 128, left: 16, right: 53 },
          menu,
          phone,
          { inset: 8, rtl: true, flipInline: true },
        ).left,
      ).toBe(16);
      expect(
        anchoredPosition(
          { top: 100, bottom: 128, left: 200, right: 237 },
          menu,
          phone,
          { inset: 8, rtl: true, flipInline: true },
        ).left,
      ).toBe(77);
    });

    it('opens above with the gap when the trigger is near the bottom', () => {
      expect(
        anchoredPosition(
          { top: 780, bottom: 808, left: 337, right: 374 },
          menu,
          phone,
          { gap: 4, inset: 8, flipInline: true },
        ),
      ).toEqual({ left: 214, top: 656 });
    });
  });
});
