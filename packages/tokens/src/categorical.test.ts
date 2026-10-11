import { describe, expect, it } from 'vitest';

import {
  categoricalColorFor,
  categoricalColorKeys,
  categoricalColors,
  categoricalDarkenStep,
  categoricalGlyphContrast,
  categoricalGlyphMinContrast,
  categoricalHues,
  isCategoricalColor,
} from './categorical.js';
import { darkColors, lightColors } from './colors.js';
import { mixHexColors } from './color-mix.js';
import { contrastRatio, isHexColor } from './contrast.js';

const schemes = ['light', 'dark'] as const;

describe('categorical colors', () => {
  it('has six hues and neutral, as hex, in both schemes', () => {
    expect(categoricalHues).toEqual([
      'green',
      'blue',
      'orange',
      'purple',
      'teal',
      'rose',
    ]);
    for (const scheme of schemes) {
      expect(Object.keys(categoricalColors[scheme]).sort()).toEqual(
        [...categoricalColorKeys].sort(),
      );
      for (const key of categoricalColorKeys)
        expect(isHexColor(categoricalColors[scheme][key])).toBe(true);
    }
  });

  it('keeps a white glyph at 3:1 on every fill in every scheme', () => {
    for (const scheme of schemes)
      for (const key of categoricalColorKeys)
        expect(
          categoricalGlyphContrast(categoricalColors[scheme][key]),
          `${scheme} ${key}`,
        ).toBeGreaterThanOrEqual(categoricalGlyphMinContrast);
  });

  it('darkens the board orange just enough: the first 1% step toward black that passes', () => {
    let steps = 0;
    let fill = '#E08600';
    while (categoricalGlyphContrast(fill) < categoricalGlyphMinContrast) {
      steps += 1;
      fill = mixHexColors('#E08600', '#000000', steps * categoricalDarkenStep);
    }
    expect(steps).toBe(5);
    expect(fill).toBe(categoricalColors.light.orange);
    // One step less does not pass.
    expect(categoricalGlyphContrast('#D78100')).toBeLessThan(3);
  });

  it('tells each fill apart from the default light and dark surface (3:1)', () => {
    for (const [scheme, surface] of [
      ['light', lightColors.surface],
      ['dark', darkColors.surface],
    ] as const)
      for (const key of categoricalColorKeys)
        expect(
          contrastRatio(categoricalColors[scheme][key], surface),
          `${scheme} ${key}`,
        ).toBeGreaterThanOrEqual(3);
  });

  it('gives every color its own fill', () => {
    const fills = categoricalColorKeys.map(
      (key) => categoricalColors.light[key],
    );
    expect(new Set(fills).size).toBe(fills.length);
  });

  it('looks a color up and fails closed on an unknown one', () => {
    expect(categoricalColorFor('teal', 'dark')).toBe('#1A96AD');
    expect(isCategoricalColor('neutral')).toBe(true);
    expect(isCategoricalColor('red')).toBe(false);
    expect(() => categoricalColorFor('red' as 'teal', 'light')).toThrow(
      RangeError,
    );
    expect(() => categoricalColorFor('teal', 'sepia' as 'light')).toThrow(
      RangeError,
    );
    expect(Object.isFrozen(categoricalColors.light)).toBe(true);
  });
});
