Scalewing request from Teisoro.

Status: accepted 2026-10-13 for `@scalewing/react` 1.39.0 (Teisoro F-012-S04, release M2 "charts", item 3; the manager views inventory's row 10 and its risk 1; plan approval under Teisoro decisions O-1 and D-1).
Renderer: react
Missing surface: `LineChart`, a value by date, straight or in steps, with markers on chosen dates, an optional area and a boxed period.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: ReportsVault and PhoneVault draw "The vault at night" every day for 90 days as a line over a tinted area, each money truck a downward triangle with its amount, the current week boxed and the last value beside the line, and "Owed to the bank" as a step line that changes on the days a check is cashed or paid back. `ColumnChart` places values by category, not by date, and has no steps or markers; drawing a line needs placed shapes, which Teisoro cannot draw (no CSS, no inline style, no SVG of its own).
Existing surface this might already be: `ColumnChart` (columns per category with a line over them); `BarChart`.
Workaround I almost used: an inline SVG with hex strokes in a Teisoro component.
Teisoro use: the Vault report's two charts, with a `ChartLegend` above each.
Proposed API (inventory): `points: {x: date, y}[]`, `curve: 'linear' | 'step'`, `area?`, `markers?: {x, label, tone}[]`, `ticks`, `formatValue`, `label`; the hidden table and responsiveness as `ColumnChart`'s.

## Accepted API (2026-10-13)

- `LineChart` (props `LineChartProps`: a `div`'s attributes but `children`, plus the list below), a forwarded ref to its box. Exported with `LineChartPoint`, `LineChartMarker`, `LineChartPeriod`, `LineChartCurve` and `lineChartCurves`.
  - `label: string`, the hidden table's caption; `valueLabel?: string`, its value column's header (default `label`).
  - `points: readonly LineChartPoint[]`: `{ x: 'YYYY-MM-DD', y }`, in date order; a date may repeat (a balance that changes twice in a day). The time axis places them by the days between them.
  - `curve?: 'linear' | 'step'` (default `'linear'`); `step` holds each value until the next date, then moves straight to the next.
  - `area?: boolean`: the area between the line and zero in a 12 % tint of the line's stroke.
  - `tone?: ChartStrokeTone` (default `'accent'`): the line, its dot and its last value (the request's boards draw the vault in the accent and what is owed in brown, Scalewing's `warning`). An addition to the inventory's list, so a second line chart can be told apart.
  - `markers?: readonly LineChartMarker[]`: `{ x, label, tone }`, `x` one of the points' dates. A 12 px downward triangle sits on the line at that date's last value (the day's closing value), its words in the tone's ink beneath it, or both above the line when the words would pass the plot's bottom. Its words are moved in to stay over the plot (clear of the value axis's words and the last value), and words that would meet an earlier marker's are left out of the drawing; the table lists every one. `markersLabel?: string` heads the table's marker column and is required with markers.
  - `ticks?: readonly string[]`: the dates the time axis labels, the first and last point's by default. They are thinned from the last back so none meet, and kept inside the chart's width.
  - `highlight?: LineChartPeriod`: `{ from, to }`, a period boxed in the dashed accent outline (exactly half a day past each end, with no inset, clipped to the plot; on a chart of one date, the whole plot when the period holds it and nothing otherwise); its rows are `aria-current`. An addition to the inventory's list: the vault board boxes "This week".
  - `endLabel?: boolean` (default `true`): the last value beside the plot's end, as on the vault board; the owed board leaves it out.
  - `formatValue` (default BarChart's plain number), `formatTick` (the value axis, default `formatValue`) and `formatDate` (the time axis and the table's row headers, default the date itself, so the consumer writes its own locale's dates).
- **Shared with ColumnChart:** the measured width before paint, the compact layout under 480 px (a shorter plot), the round scale through zero (`chart-scale.ts`), the value axis and grid, the end gutter, the boxed period (`chart-axis.ts`), every measure from tokens (`chart-metrics.ts`), the hidden `ChartTable` and the plot CSS. New private modules: `chart-dates.ts`, `line-chart-path.ts`, `line-chart-markers.ts`, `line-chart-layout.ts` and `line-chart-input.ts`, all pure and tested without a browser; `components/line-chart/LineChartDrawing.tsx`.
- **Colour:** the line, dot and markers in their stroke tones (3:1 on the surface); the last value and marker words in their ink (4.5:1). Forced colours draw the line in `Highlight`, markers and words in `CanvasText`, and drop the area.
- **Accessibility:** the SVG is `aria-hidden` and not focusable. A table in a `sw-sr-only` box (ColumnChart's `ChartTable`) holds the caption, the value and marker column headers, a row per point headed by its `formatDate`d date, the values, each marker's words in its date's last row, and the boxed rows `aria-current`.
- **Refusals:** empty words, a date that is not `YYYY-MM-DD`, points out of date order, a value that is not finite, an unknown curve or tone, a marker off the points' dates, markers without `markersLabel`, a tick outside the points' dates, or a period that ends before it starts throw a `RangeError`.
- No new tokens, layers or dependencies. New classes `sw-chart-area`, `sw-chart-marker` and `sw-chart-marker-label` (`src/css/css-line-chart.ts`); the line, dot, last value, box, grid and axis words reuse ColumnChart's plot classes.
- `endGutter`, `labelInside` and `periodBox` moved from ColumnChart's layout into the shared `chart-axis.ts` (review round two's suggestion on ColumnChart); ColumnChart's output is unchanged.

### Differences from the boards (Teisoro D-2)

- The truck markers are the ▼ glyph at 11 px in #c4291c with 11 px words; Scalewing draws a 12 px triangle and caption words in the tone the consumer picks. A truck is cash leaving the vault, and the ledger rule keeps outflows out of red, so Teisoro chooses the tone (its decision log records it).
- The area is #e8f0fa; Scalewing's is a 12 % tint of the line's stroke over the surface, which follows the palette and dark mode.
- The owed line is #8a4600; Scalewing's `warning` stroke.
- Axis words are the caption size (13 px; the boards' are 11 px). The last value is weight 600 (the board's is 700, 12 px).
- The boxed week runs half a day past its first and last dates; the board's box starts about half a week before.
- Plot heights are 192 px wide and 160 px compact (the boards' are 200, 160 and 156 px).

- Review round one (fresh Bar Raiser) CHANGES REQUIRED: marker words kept over the plot, and a one-date chart boxing only a period that holds its date. Every finding was applied: the table rows moved to a pure `line-chart-table.ts` with a shared closing-point helper (`line-chart-points.ts`), the time-axis box without an inset, refusal messages asserted, the area share moved into the tone table, the tick dates typed without a cast, a repeated font size dropped, and the gallery's lone point and snippet date.

Evidence:

- Unit tests:
  - `chart-dates.test.ts`: day counts across months, leap days and early years; nulls.
  - `line-chart-path.test.ts`: linear and step vertices, the closed area, SVG points.
  - `line-chart-markers.test.ts`: the triangle under the line with words below, above when there is no room, words moved in over the plot at its first and last dates, words left out where they meet.
  - `line-chart-table.test.ts`: each date's closing point, a date's markers in its closing row, the current rows, no marker column without markers.
  - `line-chart-layout.test.ts`: dates spread across the plot with room for the last value, the step path and area to zero, date labels thinned at 200 px and kept inside, the box half a day past its dates and clipped, a marker on its day's last value, one point and none.
  - `line-chart.test.tsx`: the hidden table with headers, values, a marker in its day's last row and the current rows, tone classes, area, marker, box and last value, default ticks and values, `endLabel: false` and a lone point's dot, class, attributes and ref, 13 refusals with their messages, the exports, the CSS.
  - `chart-axis.test.ts`: the shared end gutter.
- Gallery "LineChart": 78 nights with an area, seven markers, the last week boxed and the last value; a step line in `warning` without its last value; the first chart in a 360 px frame; no data.
- `apps/gallery/e2e/line-chart.spec.ts` on desktop-en, mobile-es and forced-colors:
  - the table read with 78 rows, seven of them current, the marker column and a marker's night, and the SVG hidden;
  - the drawing at its box's width with nothing overflowing;
  - seven downward triangles;
  - the accent line and warning markers, or `Highlight` and `CanvasText` in forced colours;
  - the 360 px frame labelling fewer dates and ending on Oct 12;
  - every segment of the step line level or upright;
  - the warning stroke in light and in dark.
