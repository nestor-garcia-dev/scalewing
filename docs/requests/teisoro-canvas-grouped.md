Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #186; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 1; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: an opt-in grey page tone for the generated canvas, `ThemeProvider canvas="grouped"`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every manager-views board sets its page on a light grey with its content in white cards (a report, a settings form, a list), and Teisoro may not restyle the page canvas in app CSS. `Box background` takes the background or the surface only, and a Box would not fill the page behind its header and gutters. The tasks of Teisoro F-012-S12, S18 and S19 list "the page surface is white, not the board's grey" as a remaining difference.
Existing surface this might already be: the generated document canvas on `[data-theme]` (always the theme's background); `Box background` (background or surface only); the subtle fill (a control's quiet fill, and lighter than some palettes' backgrounds).
Workaround I almost used: a Teisoro page wrapper with a hex background.
Teisoro use: the Reports, Services and Admin pages the boards set on grey, and later the guided forms.
Proposed API: `ThemeProvider canvas="grouped"`, opt-in, the default page unchanged.

## Accepted API (2026-10-14)

- `ThemeProvider` gains `canvas?: 'default' | 'grouped'` (`ThemeCanvas`, `themeCanvases`), default `default` (unchanged, no attribute). `grouped` writes `data-canvas="grouped"` on the themed node; a page without `ThemeProvider` may set the attribute on its `data-theme` node. An unknown value throws a `RangeError`.
- The generated canvas declares `--sw-canvas-grouped` on every `[data-theme]` node: in the light scheme the background with 7 % of the muted colour (a grey a step off white, under white cards), in the dark scheme the background itself (already darker than the surface). It is painted only on `[data-theme][data-canvas='grouped']`, so no other page changes. A nested `ThemeProvider canvas="grouped"` paints a grouped region; later surfaces that sit on the grouped grey (a dialog's body) read the same property.
- The text and muted colours keep 4.5:1 or more on it in every palette and scheme, and the light surface stays apart from it (`canvas-grouped.test.tsx`). The accent falls under 4.5:1 on any grey in some palettes (it is 4.51:1 on white in one), so links and accent words belong in the cards; the canvas holds titles and muted lines.
- The colour is a mix in the renderer, as the quiet fill and the chart tones are, not a new token: no tokens release.
- No new classes, layers or dependencies.

### Differences from the boards (Teisoro D-2)

- The boards' grey is one fixed light grey; the grouped canvas is the theme's background mixed with its muted colour, so it follows the palette, and in the dark scheme it is the background.

No board figures are quoted here.

Evidence: `canvas-grouped.test.tsx` (no attribute by default, `data-canvas` on request, the refusal, the generated rules, contrast and separation in every palette); gallery "Canvas" (a grouped page with two cards, light and dark); `apps/gallery/e2e/canvas-grouped.spec.ts` on desktop-en, mobile-es and forced-colors (the grey under white cards, muted words at 4.5:1 or more, the dark background in the dark scheme, no sideways scroll at 390 px).
