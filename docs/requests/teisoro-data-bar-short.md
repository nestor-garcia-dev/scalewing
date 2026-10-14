Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.39.0 (PR #178; accepted 2026-10-13; Teisoro F-012-S04, release M2 "charts", item 4; after M1's DataBar, Teisoro decision D-38; plan approval under Teisoro decisions O-1 and D-1).
Renderer: react
Missing surface: `DataBar` `tone="danger"`, a light red range bar for a shortage.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the ReportsOverview board's Days table draws each day's Off as a bar either side of zero, and a short day's bar in light red (#f4c7c2). DataBar shipped in 1.38.0 without a danger tone, because money out must never be red, so Teisoro drew a short day's bar `muted` and listed the red as a difference from the board (D-38). A shortage is not an outflow: red is allowed for it.
Existing surface this might already be: `DataBar` (this extends its tones); `TableCell tone="danger"` (the figure, which stays red as well).
Workaround I almost used: keeping the short day's bar `muted`, the board difference D-38 records.
Teisoro use: the Overview's Days table (and a day's Off), with `TableCell tone="danger"` on the figure.
Proposed API: `DataBar` `tone="danger"`, documented as for a shortage, never for cash leaving; its contrast and theme mixing consistent with the other tones.

## Accepted API (2026-10-13)

- `DataBarTone` and `dataBarTones` gain `'danger'`, last: `['neutral', 'success', 'muted', 'strong', 'accent', 'danger']`. The tone is for a shortage, never for cash leaving: money out stays `muted`.
- The fill is the danger colour at 40 % mixed into the surface (`dangerFillShare` in the shared chart tone table, `chart-tones.ts`), the board's light red, generated as `.sw-data-bar-danger > .sw-data-bar-fill`. Like every tone, it keeps 1.5:1 or more on the surface in every palette and scheme. It reads red beside `muted`, the grey of money out: in every palette and scheme its red channel leads its green by more than 30 points beyond the grey's.
- The shared tone table's fill tones gain `danger`, so a `ChartLegend` `bar` swatch can name a short day (`{ swatch: 'bar', tone: 'danger' }`), in the same colour. The `sw-chart-tone-danger` class gains its fill beside its stroke and ink.
- Forced colours draw it in `CanvasText`, as every tone.
- No new tokens, layers or dependencies. One new class, `sw-data-bar-danger`. Additive: no existing tone changes.

### Differences from the boards (Teisoro D-2)

- The board's short-day bar is #f4c7c2. Scalewing's is the theme's danger colour at 40 % into the surface, which is a little stronger, so it keeps 1.5:1 on a dark surface and follows the palettes.

- Review round one (fresh Bar Raiser) CHANGES REQUIRED: the legend's `bar` in `danger` shown and tested, and the rule written wherever ChartLegend lists the tone. Every finding was applied: an absolute red check beside the relative one, the browser check against `CanvasText` and against money out's grey, the tone class pinned, the ChartLegend request pointing here, `dangerFillShare` renamed, the gallery's column header, and the README's note that short and over differ by hue alone beside their side of zero and figure.

Evidence:

- `data-bar.test.tsx`:
  - the tones with `danger` last, and its generated rule;
  - an unknown tone (`warning`) refused with the new list;
  - every tone at 1.5:1 on the surface and the greys apart;
  - the shortage's red apart from money out's grey, and red on its own (its red channel leads both others), in every palette and scheme.
- `chart-tones.test.ts`: the fill tones with `danger`, and the `sw-chart-tone-danger` rule pinned.
- `chart-legend.test.tsx`: a `bar` in `danger` drawn in its tone class; a `bar` in `warning` still refused.
- Gallery:
  - "DataBar": the column either side of zero shows a short site in danger and an over site in success;
  - "ChartLegend": the statement key adds "Short of the count".
- Gallery browser specs on desktop-en, mobile-es and forced-colors:
  - `apps/gallery/e2e/data-bar.spec.ts`: the short bar's danger class; its fill differs from the over bar's and from money out's grey; both are `CanvasText` in forced colours;
  - `chart-legend.spec.ts`: six distinct statement fills in light and in dark.
