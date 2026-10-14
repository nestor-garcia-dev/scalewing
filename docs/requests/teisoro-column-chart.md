Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.39.0 (PR #176; the hidden table fix in #179; accepted 2026-10-13; Teisoro F-012-S04, release M2 "charts", item 2; the manager views inventory's row 9 and its risk 1; plan approval under Teisoro decisions O-1 and D-1).
Renderer: react
Missing surface: `ColumnChart`, columns per category (stacked or grouped by series) with an optional line on its own scale, a boxed current period and callouts.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the report boards draw 13 weeks (or 12 months) as columns: ReportsOverview "Off, last 13 weeks" (two series stacked either side of zero, the running total as a line, the current week boxed, two callouts pinned to the top with a dashed leader), ReportsRegisters (two registers), ReportsServices (checks cashed and money transfers grouped), ReportsCorrections (three stacked counts), and their phone boards at 390 px. `BarChart` is horizontal magnitudes, one bar per row, with no series, stacking, line or time axis; drawing columns needs placed shapes, which Teisoro cannot draw (no CSS, no inline style, no SVG of its own).
Existing surface this might already be: `BarChart` (horizontal, one value per row); `DataBar` (one range in a cell).
Workaround I almost used: an inline SVG with hex fills in a Teisoro component.
Teisoro use: `RunningTotalChart` (Overview, Registers, Services, Corrections), with a `ChartLegend` above it.
Proposed API (inventory): `categories`, `series: {id, label, values, tone}[]`, `mode: 'stacked' | 'grouped'`, `line?: {label, values}` (its own right-hand scale), `highlight?: index`, `callouts?: {index, text}[]`, `formatValue`, `label`. A visually hidden table carries the figures; it fits 360 px with fewer axis labels, never sideways scroll; tones come from the categorical scale.

## Accepted API (2026-10-13)

- `ColumnChart` (props `ColumnChartProps`: a `div`'s attributes but `children`, plus the list below), a forwarded ref to its box. Exported with `ColumnChartSeries`, `ColumnChartLine`, `ColumnChartCallout`, `ColumnChartMode` and `columnChartModes`.
  - `label: string`: the hidden table's caption, the chart's name.
  - `categories: readonly string[]`: the places in order; each is a row header and an axis label.
  - `series: readonly ColumnChartSeries[]`: `{ id, label, values, tone }`, a unique `id`, a value per category, and a `tone` from the categorical scale (`CategoricalColor`).
  - `mode?: 'stacked' | 'grouped'` (default `'stacked'`). Stacked, a category's positive values stack up from zero and its negative values down from it, in series order; grouped, the series stand side by side, each from zero. A zero value draws nothing; a value under a pixel draws 1 px.
  - `line?: ColumnChartLine`: `{ label, values, endLabel? }`, an accent line over the columns on its own right-hand scale. Its last value is written beside that axis (in the accent's ink) unless `endLabel` is `false`; a right-axis label it would meet is dropped.
  - `highlight?: number`: one category boxed in a dashed accent outline (the current period); its table row is `aria-current="true"`.
  - `callouts?: readonly ColumnChartCallout[]`: `{ index, text, tone? }`, words pinned in rows above the plot beside a dashed leader down to the column's top, on whichever side has room. `tone` (categorical) colours the words' ink; the text colour without it.
  - `formatValue?: (value) => string`: the figures in the table and the line's last value. It defaults to `formatBarChartValue`, BarChart's plain number.
  - `formatTick?: (value) => string`: the axes, so a consumer can write `$25k` there and `$25,000.00` in the table. It defaults to `formatValue`.
- **Scales** (`src/chart-scale.ts`, shared with LineChart):
  - A round step (1, 2, 2.5 or 5 times a power of ten) aims at 4 steps, always through zero. An all-zero chart reads 0 to 1.
  - With a line, the two scales keep their own steps but take the same number of steps below and above zero, so zero and every grid line are level. If the two lean opposite ways, both take longer steps.
- **Layout** (`src/column-chart-layout.ts`, `column-chart-bars.ts`, `column-chart-callouts.ts`, `chart-axis.ts`, `chart-metrics.ts`; pure and tested without a browser):
  - The chart is an SVG laid out in its own pixels for the width it measures (`useChartWidth`, a ResizeObserver; 624 px before it is measured), so its words stay at the caption size at every width. Its geometry stays in the renderer, as DataBar's does (Teisoro D-39).
  - Every measure comes from tokens: the caption type, spacing steps for gaps, the radius scale for corners, and the 2 px line of `chart-marks.ts`. The plot is 192 px tall, or 160 px when compact.
  - Stacked columns take 60 % of a category's width; a group takes 72 %.
  - Category labels are thinned, counted back from the last, so the latest place is always labelled. Labels sit inside the chart's width.
  - Under 480 px (`chartCompactWidth`) the chart is compact: its callouts are listed under the plot instead of drawn in it. It never scrolls sideways.
  - The SVG is drawn left to right in any writing direction, as a time axis reads.
- **Measuring and edge cases:**
  - The width is measured before the first paint (`useLayoutEffect`), so a phone never shows the wide layout first.
  - Callout words longer than their side of the leader are moved in so they stay inside the chart.
  - The boxed period is never narrower than a hairline, even when a dense chart's band is thinner than its inset.
  - A line of one point draws its dot.
  - Under a 96 px plot (`chartMinPlotWidth`), the line's axis gives up its words; its last value and the table still carry it.
  - A table with no series and no line has no header row.
- **Colour:** every mark reads the chart tones (`ChartLegend`'s table). Columns use their hue's fill (72 % into the surface), the line and box the accent stroke, and the words the ink: callouts are 30 % hue and 70 % text, at 4.5:1. Grid lines are the border colour, zero is the muted colour, and axis words are muted. Forced colours draw columns in `CanvasText` outlined in `Canvas`, the line and its last value in `Highlight`, grid lines in `GrayText`, and words in `CanvasText`.
- **Accessibility:**
  - The SVG is `aria-hidden` and not focusable.
  - A table in a `sw-sr-only` box (private `ChartTable`, shared with LineChart; the box, not the table, is hidden, because a table is never narrower than its contents and would widen a phone's page) holds the caption, a header per series and for the line, a row header per category, and every value in `formatValue`.
  - Callouts are a list (`role="list"`). It is visible under a compact chart and `sw-sr-only` otherwise, each item an `aria-hidden` dot in its hue's fill and its words.
- **Refusals:** empty words, a series or line without one finite value per category, a repeated series id, a tone off the categorical scale, an unknown mode, or a highlight or callout that is not a category's index throw a `RangeError`.
- **Additions:** no new tokens, layers or dependencies. New classes `sw-chart`, `sw-chart-svg`, `sw-chart-tick`, `sw-chart-tick-line`, `sw-chart-category`, `sw-chart-grid`, `sw-chart-zero`, `sw-chart-highlight`, `sw-chart-line`, `sw-chart-dot`, `sw-chart-end-label`, `sw-chart-leader`, `sw-chart-callout-text`, `sw-chart-column`, `sw-chart-callouts`, `sw-chart-callout` and `sw-chart-callout-dot` (`src/css/css-chart-plot.ts`, shared with LineChart).
- **BarChart:** BarChart's CSS module is renamed `css-bar-chart.ts` beside the new plot CSS, with its output unchanged. BarChart keeps its own scale (its axis reads 0 and the maximum, not round steps) and its list, which already reads every label and value. The new charts share with it the default number format (`formatBarChartValue`) and the tones its legend reads.

### Differences from the boards (Teisoro D-2)

- **The running total's scale.** The boards draw it on the columns' left scale (−$200 to $800). The request puts it on its own right-hand scale, labelled in the accent's ink with its zero level with the columns'. The last value sits beside that axis, as on the board.
- **Fills.** The boards' series tints (#8fb3d9, #c7a4dc, #9cc1e6, #e8a39c, the Services greys and blue) are categorical hues at 72 % into the surface, a little stronger, so they keep 1.5:1 on a dark surface and follow the palettes. The two registers' two blues need two hues.
- **Callout words.** The board writes callouts in a darker shade of the series (#7a4a99, #2d5f93). Scalewing writes them in the hue's ink, 30 % hue toward the text colour, for 4.5:1 in every palette. On a phone the board's dot is the ink colour; Scalewing's is the series fill.
- **Type.** Axis words are the caption size (13 px; the board's are 11 px, and the inventory forbids a smaller size), so the gutters are a little wider. Callouts and the last value are caption size at weight 600 (the board's are 12 px at 600 and 700).
- **Category labels.** Every place is labelled where the labels fit, so a wide chart may show all 13 weeks where the board shows every second. A phone shows every third or fourth, counted back from the last (the board shows every third from the first).
- **Plot height.** 192 px wide and 160 px compact; the boards' are 194 px and 156 px.
- **Count axes.** A count axis takes the round step for four steps (0 to 6 by 2 for the Corrections board's 0 to 5 by 1).

- **Review round one** (fresh Bar Raiser): CHANGES REQUIRED for the flash of the wide layout before measuring. Every finding was applied: measuring before paint, callouts kept inside the chart, the hairline box, the one-point dot, the unused axis prop removed, the grouped gap and dash patterns named in `chart-marks.ts`, `isOneOf` moved to its own module, label keys by index, no empty header row, the step clamp and the minimum plot width.

Evidence:

- Unit tests:
  - `chart-scale.test.ts`: round steps, through zero, all zero, floating-point dust, aligned scales including the board's −200 to 800, opposite leanings.
  - `chart-axis.test.ts`: value placement, gutters, thinned labels from the last, ticks clear of the end label.
  - `column-chart-bars.test.ts`: stacked either side of zero, grouped, empty.
  - `column-chart-callouts.test.ts`: sides, flips at an edge, rows.
  - `column-chart-layout.test.ts`: callout rows and leaders, levelled scales with the end label and the dropped tick, columns on zero at least 1 px, grouped slots, the box, compact at 330 px with labels inside the width, empty.
  - `column-chart.test.tsx`: the hidden table with headers, values and the current row, the hidden SVG, callouts as a list, tone classes, the line, box and last value, `endLabel: false`, compact through a measured width, defaults and `formatTick`, class, attributes and ref, 15 refusals, exports.
  - `chart-plot-css.test.ts`: catalog, roles and no hex, caption type, forced colours.
- Gallery "ColumnChart": stacked either side of zero with a running total, box and callouts; grouped; stacked counts; the same chart in a 360 px frame; no data.
- `apps/gallery/e2e/column-chart.spec.ts` on desktop-en, mobile-es and forced-colors:
  - the table read with 13 rows and the current one, and the SVG hidden;
  - the drawing at its box's width with nothing overflowing;
  - callouts drawn wide and listed on a phone;
  - two fills, or `CanvasText` in forced colours;
  - the 360 px frame labelling fewer weeks, ending on the last;
  - grouped columns side by side on one baseline;
  - two distinct fills in dark that differ from light.
- Pre-release browser run for 1.39.0: at 390 px the hidden table, then on `<table class="sw-sr-only">`, widened the page by 118 px (`split.spec.ts` and four other page-width checks failed on mobile-es and forced-colors). The table now sits in a `sw-sr-only` box; `column-chart.spec.ts` and `line-chart.spec.ts` check the page is no wider than the viewport, and the full suite on all four projects passes (497 passed, 18 conditional skips). Reviewed by a fresh Bar Raiser: approved with suggestions, all applied.
