Scalewing request from Teisoro.

Status: accepted 2026-10-11 for the `@scalewing/react` 1.28.0 release (Teisoro F-011-S03, release R2 "feedback"; Teisoro decision D-23).
Renderer: react
Missing surface: `DenominationGrid` `labelAppearance`: row labels in the text color at label weight with no tone stripe. An extension of `DenominationGrid` (`teisoro-denomination-grid.md`, `teisoro-denomination-grid-entry.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: on the F-011 canvas every count grid (27 entry boards, the read-only grids on AuditReview, ChangeOrders, VaultToday and the drawer sheets) labels its rows "Received", "Change", "Take", "Expected" in bold dark text with no colored edge. `DenominationGrid` always marks a row label with its tone (a stripe and the words in the tone, `neutral` muted), so a Teisoro grid cannot match the boards, and Teisoro owns no CSS. Release R1 kept the stripe (D-23) and deferred this option to R2.
Existing surface this might already be: row `tone` (sets the stripe and the words' color; there is no tone that means "none"); row `emphasis` (the row's fill, not its label).
Workaround I almost used: `tone="neutral"` (still a grey stripe and muted words).
Teisoro use: the `BillCount` composite and every read-only count grid on the redesign.
Proposed API: `labelAppearance?: 'tone' | 'plain'` on the grid (generic: how the row labels look).

## Accepted API (2026-10-11)

- `DenominationGridProps.labelAppearance?: DenominationLabelAppearance` (`'tone' | 'plain'`, default `tone`, unchanged; `denominationLabelAppearances` exported). `plain` sets every row label in `--sw-color-text` at label weight (600), with no stripe, in the strip and the tiles layouts; the strip's label cell takes its column's own padding back (`space-2`, `space-1` below `md`). A row's `tone` still colors its total.
- Grid-level, not per row: a grid's labels read as one set.
- Forced colors: the labels are `CanvasText`, as before.
- Failure boundary: an unknown `labelAppearance` throws a `RangeError`.
- Sizes (Teisoro D-2): the label is label type 15/20 at 600 (the boards' 15 at 600). Generated class `sw-denomination-labels-plain`, its rules in `css-denomination-label.ts`.

Evidence: `denomination-label.test.tsx` (the default unchanged, the class on a strip and on tiles, rows keeping their tone class, an unknown appearance throws, the generated rules and their order after the narrow-screen padding); gallery "DenominationGrid" (the entry example "Tag packs for the morning round" is plain); `apps/gallery/e2e/denomination-entry.spec.ts` on desktop-en, mobile-es and forced-colors (no stripe, weight 600, the text color).
