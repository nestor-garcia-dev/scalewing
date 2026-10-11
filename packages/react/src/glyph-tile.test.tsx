import { categoricalColors } from '@scalewing/tokens';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  GlyphTile,
  type GlyphTileHue,
  type GlyphTileSize,
} from './components/GlyphTile.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('GlyphTile', () => {
  it('is a decorative tile in its hue and size, md by default', () => {
    const { container } = render(
      <>
        <GlyphTile hue="teal">
          <svg data-testid="glyph" />
        </GlyphTile>
        <GlyphTile hue="neutral" size="lg">
          <svg />
        </GlyphTile>
      </>,
    );
    const [teal, neutral] = [...container.querySelectorAll('span')];
    expect(teal?.className).toBe(
      'sw-glyph-tile sw-glyph-tile-teal sw-glyph-tile-md',
    );
    expect(teal?.getAttribute('aria-hidden')).toBe('true');
    expect(teal?.querySelector('[data-testid="glyph"]')).not.toBeNull();
    expect(neutral?.className).toBe(
      'sw-glyph-tile sw-glyph-tile-neutral sw-glyph-tile-lg',
    );
  });

  it('stays hidden from assistive technology whatever is passed', () => {
    const { container } = render(
      <GlyphTile aria-hidden={false as never} hue="rose" size="sm">
        <svg />
      </GlyphTile>,
    );
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('fails closed on an unknown hue or size', () => {
    expect(() =>
      render(
        <GlyphTile hue={'red' as GlyphTileHue}>
          <svg />
        </GlyphTile>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <GlyphTile hue="blue" size={'xl' as GlyphTileSize}>
          <svg />
        </GlyphTile>,
      ),
    ).toThrow(RangeError);
  });
});

describe('GlyphTile CSS', () => {
  const css = generateStylesheet();

  it('emits the categorical fills in both schemes and a class per hue and size', () => {
    for (const [key, value] of Object.entries(categoricalColors.light))
      expect(css).toContain(`--sw-categorical-${key}: ${value};`);
    expect(css).toContain('--sw-categorical-on: #FFFFFF;');
    expect(css).toContain(
      '.sw-glyph-tile-orange { --sw-glyph-tile-fill: var(--sw-categorical-orange); }',
    );
    expect(css).toContain(
      '.sw-glyph-tile-md { height: var(--sw-control-xs-min-height); width: var(--sw-control-xs-min-height); }',
    );
    expect(css).toContain(
      '.sw-glyph-tile { border: 1px solid CanvasText; color: CanvasText; }',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-glyph-tile',
        'sw-glyph-tile-green',
        'sw-glyph-tile-neutral',
        'sw-glyph-tile-sm',
        'sw-glyph-tile-lg',
      ]),
    );
    // The dark block declares every dark fill.
    const start = css.indexOf("[data-theme='dark'] {");
    const dark = css.slice(start, css.indexOf('\n}', start));
    for (const [key, value] of Object.entries(categoricalColors.dark))
      expect(dark).toContain(`--sw-categorical-${key}: ${value};`);
  });
});
