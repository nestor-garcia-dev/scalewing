# Scalewing request from fantasy-football

Renderer: react (tokens first; native inherits glass fills and control sizes)

This file is intake for a dashboard vocabulary. Requests 1–6 are implemented in this checkout (gallery + changeset; not yet published as 0.3.0).

## Request 1 — Accent and tinted glass

Missing surface: default `accent` / `onAccent` tokens, plus glass derived from the merged accent (not a new component)

Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Those primitives already consume `--sw-color-accent` and `--sw-glass-*`. The accent is teal-green and collides with `success` on a ranked board. Glass fill is hardcoded neutral white, so a ThemeProvider accent overlay would recolor buttons and leave ice-white cards.

Existing surface this might already be: ThemeProvider `colors` overlay (hex only; cannot tint glass). Card `glass` variant.

Workaround I almost used: product hex in JSX; copying Scalewing CSS; restyling the canvas.

Proposed API:

- Light accent `#5B3DF5`, dark `#A78BFA` (verified ≥4.5:1 vs onAccent and canvas).
- `glassForAccent(accent, scheme)` in `@scalewing/tokens`. `createTheme` recomputes `theme.glass` after merging colors.
- Specular token `--sw-glass-specular` as an inset highlight on `.sw-card-glass`. Still one blur. `prefers-reduced-transparency` stays solid `surface`.
- Migration: pin old teal with `ThemeProvider` `colors={{ accent: '#0B615E', onAccent: '#FFFFFF' }}` (dark: `#7EDAD6` / `#101214`).

## Request 2 — Density (opt-in)

Missing surface: `Button`/`control` size `xs`; typography variant `data` with tabular numerals; utility `sw-tabular`

Why existing surfaces cannot: `sm` is 32px and `md` is 44px; `body` is 17px; no `font-variant-numeric: tabular-nums`. A 200-row board cannot use the marketing-page scale as row chrome.

Do not change default body/canvas size. Density is additive.

## Request 3 — Badge

Missing surface: `Badge` (web)

Why Field/Button cannot: tag chips and position labels are not press actions. Using `Button variant="ghost"` for every tag on every row is the current lie.

Existing surface: none. Ghost Button is the workaround to stop using.

Proposed API: `<Badge tone="neutral" | "accent" | "success" | "danger">QB</Badge>`

## Request 4 — SegmentedControl

Missing surface: `SegmentedControl` (web)

Why a row of Buttons cannot: Prep/Draft and week-range presets are one exclusive choice, not independent actions.

Proposed API: value + `onChange` + items `{ id, label }[]`. Compact (`xs`) by default.

## Request 5 — Table

Missing surface: `Table` with sticky header and numeric cells (web)

Why Stack of Cards cannot: rank/ADP/delta must align; sticky header under draft-clock scroll.

Proposed API: `Table` (`stickyHeader`), `TableHeader`, `TableBody`, `TableRow`, `TableCell` (`align="start" | "end"`, `numeric`).

## Later (not this milestone)

Menu (league switcher can stay a native `select` inside compact Field), StatTile, Toast, Tabs, Divider, Skeleton, EmptyState, Tooltip, Meter.

Compact Badge, compact/selected Table, and horizontal BarChart are in
`docs/requests/fantasy-football-draft-surfaces.md`.

## Request 6 — AppHeader, Nav, compact Field

Missing surface: sticky glass `AppHeader`, `Nav` link cluster, `Field` `size="xs"` / `labelVisuallyHidden`, accent focus on native `select`

Why existing surfaces cannot: Card+Stack can group chrome but does not own sticky glass header, compact native selects, or label-size nav links. User-agent blue focus and native select chrome on `<select>` is canvas ownership. Current page is `aria-current="page"` on Nav links.

Existing surface: Card `glass`, Field, `Box as="a"`.

Workaround I almost used: app CSS on `select` and `nav`; stacked Field label next to a heading.

Proposed API:

- `<AppHeader sticky>` (default sticky)
- `<Nav aria-label="Workspace">{links}</Nav>`
- `<Field size="xs" labelVisuallyHidden label="League">`
