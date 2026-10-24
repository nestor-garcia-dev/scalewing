---
'@scalewing/react': minor
---

Behaviour change: `GlyphTile` children that are a string or a number are now letters. An empty or whitespace-only string (which used to render an empty tile) and four or more letters (which used to render, clipped) now throw a `RangeError`; a number counts by its digits, so `{12345}` throws. The letters are sized from the tile and ignore the surrounding font size.

`GlyphTile` holds up to three letters in place of a glyph, such as initials ("NSL"): drawn in one line at weight 600, one letter at half the tile's side, two at 0.42, three at a third, so every count fits every size. A glyph child is unchanged. New classes `sw-glyph-tile-text`, `sw-glyph-tile-text-1`/`-2`/`-3`. No new tokens or dependencies. Request: `docs/requests/futmas-glyph-tile-three-letters.md`.
