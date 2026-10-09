Scalewing request from Teisoro.

Status: merged in #101 (2026-10-09) and released in `@scalewing/react` 1.22.0 for Teisoro F-006-S11 task 1875; Teisoro pins and adopts it in task 1880.
Renderer: react
Missing surface: `BarChart` `formatValue` (the axis and the values in the consumer's unit) and `diverging` (zero in the middle, negative bars to the start).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the chart draws its own axis with `formatBarChartValue(scaleMax)`, so a chart of dollars reads "0" to "0.3" with no unit, and every bar grows from the start, so a shortage and an overage of the same size look alike but for their color.
Existing surface this might already be: `BarChart` (magnitude only); `valueLabel` formats each bar's value but not the axis.
Workaround I almost used: hiding the axis, or a product-drawn chart with inline widths.
Source: Teisoro UX review `admin-reports.md`, finding RPT-14 (minor; the Scalewing part). The Services variance trend: one red bar from "0" to the end of the track labelled "-$0.25", the axis "0 … 0.3"; F-007 task 1640 passes signed `valueLabel`s and shows the chart only with two closed days.
Teisoro use: `apps/teisoro-web/src/app/services-reports/VariancePanel.tsx`, the variance trend: `formatValue={(dollars) => money(dollars)}` and `diverging`, so short days run left of zero in red and over days right of it.

Proposed API: `formatValue?: (value: number) => string` and `diverging?: boolean` on `BarChart`.

Behavior and failure boundary:

- `formatValue` writes each axis tick and every item's value without a `valueLabel`. The default is `formatBarChartValue`, as before; the magnitude axis's start, which was the literal "0", is now `formatValue(0)` (still "0" by default). The consumer owns the unit and the sign glyph.
- `diverging` adds `sw-bar-chart-diverging`: the track gets a one-pixel hairline at its middle (the border color, `CanvasText` in forced colors); a fill starts at the middle (`margin-inline-start: 50%`) and is `fill × 50%` wide, and a negative fill ends at the middle (`margin-inline-start: 50% − fill × 50%`), so each value keeps its share of the same scale (the peak magnitude, or `max`) on its own side. The end at zero is square (logical radii, so right to left mirrors it). The axis is three ticks, `formatValue(−max)`, `formatValue(0)` and `formatValue(max)`, spread across the track. Labels, values and colors are unchanged.
- Off by default, so an existing chart with negative values (a magnitude chart of contributions) renders as before.

Rejected alternatives:

- Diverging whenever a value is negative. Existing magnitude charts with negative contributions would change shape in a minor release.
- An asymmetric zero (placed at the data's own minimum and maximum). Over and short of the same size should look the same size; a symmetric scale says that, and `max` keeps several charts comparable.
- A `formatAxis` separate from the values. One unit per chart; `valueLabel` already covers a bar whose value needs other words.

Evidence: `chart.test.tsx` ("BarChart formatValue and diverging": the axis and an unlabelled value through `formatValue`, a `valueLabel` kept; the diverging class, the three ticks, each fill's share; the generated rules); `apps/gallery/e2e/bar-chart.spec.ts` on desktop-en, mobile-es and forced-colors: the gallery's "Change in sightings" axis reads "−9", "0", "+9"; the −9 bar runs from the track's start to its centre and the +6 bar from the centre two thirds of the half; the magnitude chart above still starts its negative bar at the track's start.

## Follow-up request (2026-10-09, Teisoro F-006-S11 task 1890): a bar colored by meaning

Status: implemented on `teisoro/f006-s11-review-findings` for Teisoro F-006-S11 task 1890; awaiting review, merge and a `@scalewing/react` minor release.
Source: Teisoro's storyboard re-review of F-006-S11 (task 1890). The Services variance trend is diverging: an overage is a warning and a shortage is danger, as Teisoro's variance badges say, but a bar's fill is the accent, or danger only because the value is negative, so an overage reads as an ordinary accent bar.

Teisoro need: in `VariancePanel.tsx`, each day's bar in the tone of its badge: `tone: dollars > 0 ? 'warning' : 'danger'`.

Proposed and implemented API: `tone?: BarChartTone` on `BarChartItem`, where `BarChartTone` is `'accent' | 'success' | 'warning' | 'danger'` (exported from the package index, with the list `barChartTones`, as `badgeTones` and `statTileTones` are). Generated classes `sw-bar-chart-fill-accent`, `sw-bar-chart-fill-success`, `sw-bar-chart-fill-warning` and `sw-bar-chart-fill-danger`.

Behavior and failure boundary:

- A tone overrides the sign's default fill (the accent, or danger through `sw-bar-chart-fill-negative`). The negative class stays on a negative bar, since it also shapes a diverging bar (its end at zero), so a toned negative bar keeps its geometry and takes the tone's color: the tone rules follow the negative rule at the same specificity.
- Without a tone the classes and the look are unchanged.
- Every tone keeps 3:1 against the track (the glass fill over the page) in every palette and scheme: lowest accent 4.32:1 (synthwave dark), success 5.85:1, warning 5.43:1 (indigo light), danger 4.02:1 (mocha dark).
- Forced colors: a token fill was painted as the canvas there, so every bar, toned or not, was invisible on its track. Every fill is now `CanvasText` in forced colors, after the tones; the value, its sign and its side of zero carry the meaning.
- The color is a cue beside the value and the label, never the only sign of the meaning. An unknown tone throws a `RangeError` (it would produce a class with no rule).

Rejected alternatives:

- `positiveTone` and `negativeTone` on the chart. Shorter for Teisoro's one chart, but a chart whose bars mean different things regardless of sign (a target met or missed) needs the per-item tone anyway, and one item prop covers both.
- Badge's tone list (with `neutral`). A neutral bar is the accent default; `neutral` would be a second name for no tone.
- Distinct system colors per tone in forced colors. There are not enough system colors that read as fills, and `Highlight` already means selection.

Evidence: `chart.test.tsx` ("BarChart tone": each tone's class over its sign's, an untoned bar unchanged, an unknown tone refused, the tone rules after the negative one and in the catalog, the forced-colors fill, and every tone at 3:1 against the track in every palette and scheme); `apps/gallery/e2e/bar-chart.spec.ts` "A BarChart item tone colors its bar by meaning" on desktop-en, mobile-es and forced-colors: the gallery's new "Feed against plan" diverging chart draws "Otter pool" (+3 kg) in the warning token right of zero and "Owl barn" (−4 kg) in the danger token left of it, the untoned "Change in sightings" chart keeps its danger negative bar, and in forced colors both fills are one system color unlike the track.
