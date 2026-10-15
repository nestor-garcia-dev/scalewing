Scalewing request from Teisoro.

Status: accepted 2026-10-14 (Teisoro F-012-S23, release M4 "board fidelity", item 6; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: two opt-in `BarChart` options: a `neutral` bar tone, and an appearance with no track and no axis.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the Services board's checks cashed by weekday greys the usual days and keeps the two busiest in blue, and the bounced checks board draws its days to pay back as bare bars with each value beside its bar, with no track and no axis. `BarChart` tones are accent, success, warning and danger, and it always draws a track and a value axis. Teisoro F-012-S14 and S15 list both as remaining differences (S14's weekday bars are all accent, D-138).
Existing surface this might already be: `BarChart` (tones without a grey, always tracked); `DataBar` (a decorative bar in a table cell, not a labelled chart); `ColumnChart` (columns, not bars).
Workaround I almost used: a list of `DataBar`s with Teisoro's own labels and values.
Teisoro use: Reports › Services (checks cashed by weekday) and Reports › Bounced checks (days to pay back).
Proposed API: `BarChartItem tone="neutral"` and `BarChart appearance="bare"`.

## Accepted API (2026-10-14)

- `BarChartTone` gains `neutral` (`barChartTones` is now the charts' `chartStrokeTones`, the same five in the same order, and a bar's colour is `chartStroke(tone)` from `css/chart-tones.ts`): the muted colour, as a chart's neutral stroke is, for a bar that is counted but not the point. It keeps 3:1 against the track and against the surface in every palette and scheme, as every tone does.
- `BarChart` gains `appearance?: 'track' | 'bare'` (`BarChartAppearance`, `barChartAppearances`), default `track` (unchanged). `bare` (`sw-bar-chart-bare`) draws no track (transparent, its room kept so labels and values line up) and leaves out the value axis; a diverging bare chart keeps its zero hairline; in forced colours the track's edge is the canvas colour, since forcing replaces a transparent one. The values stay in the list beside their labels. An unknown appearance throws a `RangeError`.
- No new tokens or dependencies.

### Differences from the boards (Teisoro D-2)

- The neutral bar is the muted grey, darker than the boards' light grey, so it keeps 3:1 on the surface.
- The bars keep the chart's pill ends and track height.

No board figures are quoted here.

Evidence: `bar-chart-bare.test.tsx` (the neutral class and rule, the axis by default and none when bare, the values still read, the refusal, every tone at 3:1 on the surface in every palette); `chart.test.tsx` updated for the neutral tone (its rule, the index export, 3:1 against the track); gallery "BarChart" (owls heard by night, bare, the usual nights neutral and the busiest in the accent, in a card); `apps/gallery/e2e/bar-chart-bare.spec.ts` on desktop-en, mobile-es and forced-colors (no axis, a transparent track, its edge the canvas colour in forced colours, neutral apart from the accent at 3:1 on the card, light and dark, no sideways scroll at 390 px).
