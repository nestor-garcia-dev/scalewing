# Scalewing request from fantasy-football

Renderer: react (web). Draft round board canvas: why chips, dense recommendation
tables, and a horizontal factor-contribution chart.

Status: implemented in this checkout (gallery + changeset; not yet published).

## Request 1 — Compact Badge chicklets

Missing surface: `Badge` `size="sm"` (prop on the existing primitive)

Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Position proposals and why chips are labels, not press actions. Default Badge
uses control `xs` min-height (28px), which stacks too tall when several chips
sit in one table cell.

Existing surface this might already be: Badge. Not a second Chip control.
Not SegmentedControl (exclusive choice). Not Button.

Workaround I almost used: raw spans, copied pill CSS, hex in JSX.

Proposed API: `<Badge size="sm">Workhorse</Badge>`. Default `md` keeps the
current chip. Badge stays non-interactive.

## Request 2 — Compact Table and selected row

Missing surface: `Table` `density="compact"` and `TableRow` `selected`

Why a second table component cannot: roster, round recommendations, and the
factor breakdown are the same Table. Draft needs denser cell padding and a
current-row marker (the canvas accent dot on Best). `compact` is a legacy HTML
table attribute, so density is a named prop.

Existing surface: Table, stickyHeader, numeric, truncate.

Workaround I almost used: row background hex, a parallel DenseTable.

Proposed API: `<Table density="compact">` and `<TableRow selected>`.

## Request 3 — Horizontal BarChart

Missing surface: `BarChart` (new web component)

Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Factor contributions are a labeled horizontal magnitude chart (category, track,
value). Layout primitives cannot encode fill ratio, a 0–max axis, or negative
danger fill without inventing widths and colors in product JSX.

Existing surface: none. Table can list the same numbers; it is not the chart.
Meter is not in the catalog.

Workaround I almost used: canvas SDK BarChart in the product, SVG with hex,
recharts.

Proposed API:

```ts
<BarChart
  aria-label="Factor contributions"
  max={6}
  items={[
    { label: 'Strength of schedule', value: 1 },
    { label: 'Injury', value: -1.5 },
  ]}
/>
```

Fill uses `--sw-color-accent` (danger when value is negative). Scale math lives
in `@scalewing/tokens`. Native chart is out of scope until a native consumer
asks.
