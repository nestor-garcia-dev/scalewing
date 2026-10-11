Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.29.0 (PR #128; Teisoro F-011-S04, release R3 "identity", item 11; the redesign inventory's row 6). Depends on the categorical colours (`categorical-colors.md`, `@scalewing/tokens` 1.5.0).
Renderer: react
Missing surface: `GlyphTile`, a small rounded square in a categorical colour holding a white glyph.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: 37 F-011 boards mark each service with a coloured tile (24 square, radius 6, a white 14 glyph) in the segmented switcher, the ledger, the Show filter, menus and headers, and 36 boards mark drawer, vault and sheet headers with a grey tile (32, radius 9). No Scalewing surface fills a box with a categorical colour; `Box` takes `background` surface or background only, `Badge` is text, and `StatTile`'s glyph circle is the accent tint. Teisoro owns no CSS or colour.
Existing surface this might already be: `StatTile` `glyph` (a tinted circle in a figure tile, accent only); `Badge` (a word, not a mark).
Workaround I almost used: hex in a `style` (not allowed).
Teisoro use: `ServiceTile` (service → hue + Lucide glyph) and `DrawerTile` (neutral) in `apps/teisoro-web/src/app/ui/`, then the switcher, ledger, filter, page and sheet headers. The `ServiceTile` name and the mapping stay in Teisoro (inventory risk 3).
Proposed API (inventory): `hue: CategoricalHue | 'neutral'`, `size: 'sm' (24) | 'md' (28) | 'lg' (32)`, `children` = glyph slot. Decorative (`aria-hidden`).

## Accepted API (2026-10-11)

- `GlyphTile` (props `GlyphTileProps`): `hue: GlyphTileHue` (`@scalewing/tokens` `CategoricalColor`: `green`, `blue`, `orange`, `purple`, `teal`, `rose`, `neutral`), `size?: GlyphTileSize` (`'sm' | 'md' | 'lg'`, default `md`; `glyphTileSizes` exported), `children` (the consumer's glyph), and the `span`'s HTML attributes.
- Always `aria-hidden="true"` (a consumer cannot turn it off); the visible name beside it carries the meaning.
- The fill is `--sw-categorical-<hue>` (new custom properties generated from the tokens in both schemes, with `--sw-categorical-on`, white); the glyph is white and drawn at spacing step 4 (16) whatever its own size, when it is the tile's direct child SVG (pass the Lucide component directly). A white glyph keeps 3:1 on every fill (tested in tokens and in the browser). Forced colors draw a `CanvasText` edge and glyph.
- Failure boundary: an unknown `hue` or `size` throws a `RangeError`.
- Sizes on Scalewing's scale (Teisoro D-2): sm 24 (`space-5`, board 24), md 28 (the `xs` control height), lg 32 (`space-6`, board 32); radius `sm` 8 at every size (the boards' 6 at 24 and 9 at 32); glyph 16 (the boards' 14 at 24 and about 18 at 32).
- Generated classes `sw-glyph-tile`, `sw-glyph-tile-<hue>` (seven), `sw-glyph-tile-sm`, `sw-glyph-tile-md`, `sw-glyph-tile-lg`.

Evidence: `glyph-tile.test.tsx` (classes, default size, always hidden, failures, the generated custom properties in both schemes and the rules); gallery "GlyphTile" (every hue at every size, a habitat list); `apps/gallery/e2e/glyph-tile.spec.ts` on desktop-en, mobile-es and forced-colors (24/28/32, a 16 glyph, white glyph at 3:1 on each fill, seven distinct fills, `aria-hidden`, the forced-colors edge).
