import { categoricalColorKeys } from '@scalewing/tokens';

export const glyphTileSizes = ['sm', 'md', 'lg'] as const;

/** `sm` 24, `md` 28 (the xs control height), `lg` 32. */
export type GlyphTileSize = (typeof glyphTileSizes)[number];

/** The most letters a tile holds, such as a three-letter crest ("NSL"). */
export const glyphTileLetterLimit = 3;

/**
 * How far a tile holding letters mixes its fill toward black. Letters are
 * text (WCAG 1.4.3, 4.5:1), and the categorical fills keep a white glyph at
 * only 3:1 (neutral 3.26:1, orange 3.06:1): a 25 % mix keeps white letters
 * at 5:1 or more on every fill in both schemes (orange, the lightest after
 * the mix, 5.08:1). A glyph keeps the fill as it is.
 */
export const glyphTileLetterDarken = 0.25;

const tileSide: Record<GlyphTileSize, string> = {
  sm: 'var(--sw-space-5)',
  md: 'var(--sw-control-xs-min-height)',
  lg: 'var(--sw-space-6)',
};

function hueRules(): string {
  return categoricalColorKeys
    .map(
      (key) =>
        `.sw-glyph-tile-${key} { --sw-glyph-tile-fill: var(--sw-categorical-${key}); }`,
    )
    .join('\n');
}

function sizeRules(): string {
  return Object.entries(tileSide)
    .map(
      ([size, side]) =>
        `.sw-glyph-tile-${size} { --sw-glyph-tile-side: ${side}; height: ${side}; width: ${side}; }`,
    )
    .join('\n');
}

/*
 * A rounded square in a categorical fill with the consumer's glyph centred
 * in white, sized to spacing step 4 whatever the glyph's own size. It is
 * decoration: the words beside it carry the meaning. Letters still have to
 * be readable text, so a tile holding them takes a deeper fill. Forced colors drop the
 * fill, so a border keeps the tile's shape and the glyph takes the text
 * color.
 */
export function cssGlyphTileClasses(): string {
  return `.sw-glyph-tile {
  align-items: center;
  background: var(--sw-glyph-tile-fill);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-categorical-on);
  display: inline-flex;
  flex: none;
  justify-content: center;
}

.sw-glyph-tile > svg {
  flex: none;
  height: var(--sw-space-4);
  width: var(--sw-space-4);
}

/*
 * Letters in place of a glyph: one line, centred, weight 600, the line as
 * tall as the letters, sized from the tile's side rather than the text
 * round it, so they fit at every size: one letter at half the side, two
 * at 0.42 of it, three at a third, tightened a little, so even a wide
 * trio ("WMW") fits inside the smallest tile.
 */
.sw-glyph-tile-text {
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.sw-glyph-tile-text-1 { font-size: calc(var(--sw-glyph-tile-side) / 2); }

.sw-glyph-tile-text-2 { font-size: calc(var(--sw-glyph-tile-side) * 0.42); }

.sw-glyph-tile-text-3 {
  font-size: calc(var(--sw-glyph-tile-side) / 3);
  letter-spacing: -0.02em;
}

${hueRules()}

/* Letters are text: the fill darkens just enough for 4.5:1 (glyphTileLetterDarken). */
.sw-glyph-tile:has(> .sw-glyph-tile-text) {
  background: color-mix(in srgb, var(--sw-glyph-tile-fill), black ${glyphTileLetterDarken * 100}%);
}

${sizeRules()}

@media (forced-colors: active) {
  .sw-glyph-tile { border: 1px solid CanvasText; color: CanvasText; }
}`;
}

export function glyphTileClassCatalog(): string[] {
  return [
    'sw-glyph-tile',
    ...categoricalColorKeys.map((key) => `sw-glyph-tile-${key}`),
    ...glyphTileSizes.map((size) => `sw-glyph-tile-${size}`),
    'sw-glyph-tile-text',
    'sw-glyph-tile-text-1',
    'sw-glyph-tile-text-2',
    'sw-glyph-tile-text-3',
  ];
}
