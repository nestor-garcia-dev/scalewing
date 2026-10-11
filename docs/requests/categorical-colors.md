Scalewing request from Teisoro (system-wide token work).

Status: released in `@scalewing/tokens` 1.5.0 (PR #126; Teisoro F-011-S04, release R3 "identity", item 10; the redesign inventory's section 2 and row 6; Teisoro decision D-3).
Renderer: tokens (consumed by `@scalewing/react` `GlyphTile` next)
Missing surface: a generic categorical colour scale: six hues and a neutral, for tiles that tell a small set of kinds apart.
Why the semantic colours cannot do this: the F-011 canvas marks each of Teisoro's six services with a coloured rounded tile and a white glyph (37 boards), and drawer, vault and sheet headers with a grey one (36 boards). The semantic colours carry meaning (accent, success, warning, danger); a service is not a success or a danger, and six kinds need six hues that read apart. Teisoro owns no colour, so the hues must be tokens.
Existing surface this might already be: semantic colours (meaning, not kind); named palettes (they retint the accent, not a set of kinds); `BarChart` tones (meaning).
Workaround I almost used: hex in JSX (not allowed).
Teisoro use: `ServiceTile` (service → hue) and `DrawerTile` (neutral) on `GlyphTile`. The mapping from service to hue stays in Teisoro.
Board values: cash check `#2E8F47`, money transfer `#0A7AFF`, money order `#E08600`, bill pay `#8E5CD9`, phone recharge `#1A96AD`, bounced check `#C2415D`, neutral `#8E8E93`. ServicesDayLedger2 uses a second set (`#0A84FF`, `#FF9500`, `#1AA0B8`); D-3 takes the set most boards use.

## Accepted API (2026-10-11)

- `categoricalHues = ['green', 'blue', 'orange', 'purple', 'teal', 'rose']` (`CategoricalHue`), `CategoricalColor = CategoricalHue | 'neutral'`, `categoricalColorKeys` (the hues then `neutral`).
- `categoricalColors: Record<ColorScheme, Record<CategoricalColor, string>>`, `categoricalColorFor(color, scheme)` (a `RangeError` on an unknown colour), `isCategoricalColor`.
- `onCategorical = '#FFFFFF'`, the glyph colour on every fill (a glyph, not text: orange, neutral and teal are under 4.5:1 with white, so a categorical fill is not a text background); `categoricalGlyphMinContrast = 3` (a glyph is a graphical object, WCAG 1.4.11) and `categoricalGlyphContrast(fill)`.
- Values (light and dark alike): green `#2E8F47` (4.09:1 with white), blue `#0A7AFF` (4.01), orange `#D57F00` (3.06; the board's `#E08600` is 2.77, darkened in 1% mixes toward black until it passes: five steps; four give `#D78100`, 2.99), purple `#8E5CD9` (4.48), teal `#1A96AD` (3.49), rose `#C2415D` (4.99), neutral `#8E8E93` (3.26, unchanged: it already passes 3:1, so D-3's "darken grey just enough" needs no change). Each fill is also 3:1 or more against the default light (`#FFFFFF`) and dark (`#1C1C1E`) surface. Palettes do not overlay the fills, so on a strong palette surface (sunburst, harvest, postcard, mocha) a fill may sit under 3:1 from it; the guarantee is the white glyph on the fill, which carries the meaning (WCAG 1.4.11 does not require the tile's edge).
- Dark repeats light: the fills are deep enough for a dark canvas, and a kind keeps its colour across schemes.
- Not semantic colours: not in `ColorTokens`, not overlaid by palettes or `createTheme`, no `Theme` change.

The web gallery shows every categorical colour with the `@scalewing/react` `GlyphTile` change that first generates them as CSS (R3 item 11).

Evidence: `packages/tokens/src/categorical.test.ts` (completeness and hex in both schemes, white glyph 3:1 on every fill, the orange step derived in the test, 3:1 against both surfaces, distinct fills, the lookup and its failure).

Sign-off: additive (minor). The owner delegated plan approval for Teisoro F-011 (Teisoro decisions O-1 to O-3, D-1); Claude, acting for the owner, signed off for both renderer agents (`@scalewing/react`, `@scalewing/react-native`).
