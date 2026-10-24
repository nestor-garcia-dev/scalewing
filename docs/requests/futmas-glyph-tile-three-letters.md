Scalewing request from FutMas.

Status: accepted 2026-10-24 (FutMas F-010-S09 "desktop shell and league overview", release W2 "the league frame"; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing). To ship in `@scalewing/react` 1.48.0.
Renderer: react
Missing surface: `GlyphTile` holding up to three letters (a league's or a team's initials, "NSL") that fit the tile at every size.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: GlyphTile sizes only a direct-child SVG; words inherit the text size round the tile, so "NSL" (and even "HM") at a 15–17 px label overflows the 24 px `sm` tile and is clipped in the AppShell rail, the sidebar and FixtureRow marks. FutMas owns no CSS to shrink them.
Existing surface this might already be: `GlyphTile` itself (glyphs only); `Badge` (a status, not a crest).
Workaround I almost used: a generic glyph in place of the initials, which loses which league or team it is.
FutMas use: league and team crests (`GlyphTile hue="neutral"` with initials) in the league switcher, the rail's compact trigger, FixtureRow marks and the standings.

## Proposed API (from the brief)

No new prop: words given as `children` (a string) fit up to three characters at every size; four or more throw a `RangeError`.

## Accepted API (2026-10-24)

- Words (a string or a number) as `children` are trimmed and drawn as letters in a `span.sw-glyph-tile-text` (one line, weight 600, line height 1), sized from the tile's side (`--sw-glyph-tile-side`, set by each size class) rather than the text round it: one letter at half the side (`sw-glyph-tile-text-1`), two at 0.42 (`-2`), three at a third, tightened by 0.02em (`-3`). Measured in Chromium, a wide trio ("WMW") is 23.2 px in the 24 px `sm` tile, and every count fits every size (browser spec `glyph-tile-letters.spec.ts`).
- Letters are counted as code points (an astral letter counts once). Empty or blank words, or more than three letters, throw a `RangeError` (`GlyphTile letters are 1 to 3 characters: …`). A glyph (any other node) is drawn as before.
- The tile stays `aria-hidden`; forced colours keep its edge and draw the letters in `CanvasText`.

### Deviation from the brief

The brief said to keep one and two letters as they were. They inherited the surrounding text size, so two letters ("HM", 27 px at 17 px) already overflowed the 24 and 28 px tiles; they now take sizes from the tile too, so every count fits. A single letter is drawn a little smaller than a 17 px label in the `sm` tile (12 px).

### Classes

`sw-glyph-tile-text`, `sw-glyph-tile-text-1`, `sw-glyph-tile-text-2`, `sw-glyph-tile-text-3`; the custom property `--sw-glyph-tile-side` on the size classes.

No new tokens, public breakpoints or dependencies.
