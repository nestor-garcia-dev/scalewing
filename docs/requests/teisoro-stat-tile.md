Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 820; pending independent review and packed-consumer verification.
Renderer: react
Missing surface: `StatTile`, one prominent figure with its label.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the frozen Angular pages open every report and list with a row of figure tiles (employees: Active / Inactive / Total; closeout reports: five totals with the first one filled; every Services report tab: two to four), each with a glyph, a small uppercase label, a large tabular value and sometimes a second line. Teisoro composed this in task 805 (`Card variant="outlined"` + `Text variant="heading"` + a caption) and the rendered-parity contract said that a second repeat would be the request; task 820 repeats it twelve times across three routes and needs the filled "primary" tile, a glyph slot and a toned value, which the composition cannot express without Teisoro CSS.
Existing surface this might already be: `Card` + `Text` (the composition above); `DenominationGrid tiles` (per-denomination counts, not a single figure); `Progress` (a bar, not a figure).
Workaround I almost used: keeping the outlined-card composition and hiding the primary emphasis and the glyph.
Teisoro use: `docs/design/remaining-routes/02-employees.md`, `03-closeout-reports.md`, `04-services-reports.md`.
Proposed API: `StatTile` with `label: ReactNode`, `value: ReactNode`, `glyph?: ReactNode` (the consumer's Lucide glyph, ADR 0008), `tone?: 'default' | 'accent' | 'success' | 'danger' | 'warning'` for the value, `caption?: ReactNode` (a second line under the value) and `emphasis?: 'default' | 'primary'` (fills the tile in the accent with `onAccent` text for the one figure a page leads with). Renders a `Card variant="outlined"` shaped surface (generated `sw-stat-tile`, `sw-stat-tile-primary`, `sw-stat-tile-glyph`, `sw-stat-tile-body`, `sw-stat-tile-label`, `sw-stat-tile-value`, `sw-stat-tile-caption`): label in the `label` variant, value in the `heading` variant with tabular numerals, glyph in a tinted circle at the start; the tone and the primary text colours come from `Text color`, not from extra classes. Sizes to its grid cell.
Behavior and failure boundary: presentation only; no interaction, no number formatting (the consumer passes formatted text).

Scalewing owns the classes, tests, gallery evidence and changeset. Teisoro owns the figures, their formatting and the glyph.
