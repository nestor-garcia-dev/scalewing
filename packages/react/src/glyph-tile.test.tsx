import { categoricalColors } from '@scalewing/tokens';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

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
      '.sw-glyph-tile-md { --sw-glyph-tile-side: var(--sw-control-xs-min-height); height: var(--sw-control-xs-min-height); width: var(--sw-control-xs-min-height); }',
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

describe('GlyphTile letters', () => {
  it('draws one to three letters sized by their count', () => {
    const { container } = render(
      <>
        <GlyphTile hue="teal">H</GlyphTile>
        <GlyphTile hue="teal">{' HM '}</GlyphTile>
        <GlyphTile hue="blue" size="sm">
          NSL
        </GlyphTile>
        <GlyphTile hue="blue">{7}</GlyphTile>
      </>,
    );
    const texts = [...container.querySelectorAll('.sw-glyph-tile-text')];
    expect(texts.map((text) => [text.className, text.textContent])).toEqual([
      ['sw-glyph-tile-text sw-glyph-tile-text-1', 'H'],
      ['sw-glyph-tile-text sw-glyph-tile-text-2', 'HM'],
      ['sw-glyph-tile-text sw-glyph-tile-text-3', 'NSL'],
      ['sw-glyph-tile-text sw-glyph-tile-text-1', '7'],
    ]);
  });

  it('leaves a glyph as it is', () => {
    const { container } = render(
      <GlyphTile hue="teal">
        <svg />
      </GlyphTile>,
    );
    expect(container.querySelector('.sw-glyph-tile-text')).toBeNull();
  });

  it.each([['NSLX'], [' '], ['']])('refuses the words %j', (words) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<GlyphTile hue="teal">{words}</GlyphTile>)).toThrow(
      new RangeError(`GlyphTile letters are 1 to 3 characters: ${words}`),
    );
    vi.restoreAllMocks();
  });

  it('counts a number by its digits: 0 draws, four digits throw', () => {
    const { container } = render(<GlyphTile hue="teal">{0}</GlyphTile>);
    expect(container.querySelector('.sw-glyph-tile-text-1')?.textContent).toBe(
      '0',
    );
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<GlyphTile hue="teal">{12345}</GlyphTile>)).toThrow(
      new RangeError('GlyphTile letters are 1 to 3 characters: 12345'),
    );
    vi.restoreAllMocks();
  });

  it('counts a letter outside the basic plane as one', () => {
    const { container } = render(<GlyphTile hue="rose">{'𝔸𝔹𝔺'}</GlyphTile>);
    expect(container.querySelector('.sw-glyph-tile-text-3')).not.toBeNull();
  });

  it('sizes the letters from the tile side', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-glyph-tile-sm { --sw-glyph-tile-side: var(--sw-space-5); height: var(--sw-space-5); width: var(--sw-space-5); }',
    );
    expect(css).toContain(
      '.sw-glyph-tile-text-1 { font-size: calc(var(--sw-glyph-tile-side) / 2); }',
    );
    expect(css).toContain(
      '.sw-glyph-tile-text-3 {\n  font-size: calc(var(--sw-glyph-tile-side) / 3);',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-glyph-tile-text', 'sw-glyph-tile-text-3']),
    );
  });
});
