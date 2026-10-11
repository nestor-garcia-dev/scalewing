---
'@scalewing/react': minor
---

`GlyphTile` (with `GlyphTileProps`, `GlyphTileHue`, `GlyphTileSize` and `glyphTileSizes`): a small rounded square in a categorical colour holding the consumer's glyph in white, the mark of a kind beside its name (`docs/requests/teisoro-glyph-tile.md`, Teisoro F-011 release R3).

- `hue` (`green`, `blue`, `orange`, `purple`, `teal`, `rose` or `neutral`, from `@scalewing/tokens` categorical colours), `size` (`sm` 24, `md` 28 by default, `lg` 32), `children` (the glyph, drawn at spacing step 4).
- Always `aria-hidden`; forced colors draw its edge. An unknown `hue` or `size` throws a `RangeError`.
- New generated custom properties `--sw-categorical-<colour>` and `--sw-categorical-on` in both schemes, and classes `sw-glyph-tile`, `sw-glyph-tile-<hue>` and `sw-glyph-tile-<size>`. Needs `@scalewing/tokens` 1.5.0. No new dependencies.
