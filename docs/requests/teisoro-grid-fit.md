# Teisoro: a grid whose columns fit its width

Status: implemented, pending release, for the next `@scalewing/react` minor.

Scalewing request from Teisoro.

Renderer: react
Missing surface: `Grid` `fit`, as many columns as the grid's width holds at a minimum column width
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) builds a public site whose boards lay rows of three or four feature cards that reflow by width (four across on a laptop, two on a tablet, one on a phone). `Grid` takes a fixed count with one phone override at `md`, so four columns crush to 170 px cards between 768 and 1100 px, and a product may not write its own `grid-template-columns`.
Existing surface this might already be: `Grid` `columns` and `columnsBelow` (fixed counts), `ListGroup` `tiles`
Workaround I almost used: `columns={2}` everywhere, which leaves the boards' four-across rows at two
Proposed API (reusable names only): `<Grid fit="narrow | medium | wide" gap={4}>`

## Behaviour

- `fit` sets `repeat(auto-fit, minmax(min(100%, <minimum>), 1fr))`: `narrow` 15rem, `medium` 16.25rem, `wide` 18.75rem. Columns share the row; a grid narrower than the minimum has one column, so nothing scrolls sideways.
- A fitted grid takes no `columns` or `columnsBelow`; either, or an unknown `fit`, throws a `RangeError`.
- New classes `sw-grid-fit-narrow|medium|wide`; `gridFits` lists the names.
- Consumer: the feature cards on Teisoro's public pages (F-017 S03).
