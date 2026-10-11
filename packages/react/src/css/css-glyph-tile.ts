import { categoricalColorKeys } from '@scalewing/tokens';

export const glyphTileSizes = ['sm', 'md', 'lg'] as const;

/** `sm` 24, `md` 28 (the xs control height), `lg` 32. */
export type GlyphTileSize = (typeof glyphTileSizes)[number];

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
        `.sw-glyph-tile-${size} { height: ${side}; width: ${side}; }`,
    )
    .join('\n');
}

/*
 * A rounded square in a categorical fill with the consumer's glyph centred
 * in white, sized to spacing step 4 whatever the glyph's own size. It is
 * decoration: the words beside it carry the meaning. Forced colors drop the
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

${hueRules()}

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
  ];
}
