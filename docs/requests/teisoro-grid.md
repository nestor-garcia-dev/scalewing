Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 800; pending independent review and packed-consumer verification.
Renderer: react
Missing surface: `Grid`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Inline` gives children their content width and `Stack` gives one column; the generated stylesheet has no grid or column utility (`sw-stack`, `sw-inline`, `sw-container` only). Equal-width tiles that keep their row on desktop and drop to fewer columns on a phone cannot be composed from the published classes without product CSS.
Existing surface this might already be: Inline with `wrap` (content-width children, no equal columns), Stack (one column).
Workaround I almost used: product-owned `display: grid` CSS, inline `style` with `gridTemplateColumns`, or fixed-width Buttons.
Teisoro use: the Services day action grid (tiers of one, two, and three equal-width action tiles that collapse to two on a phone), the drawer panel's stat tiles, and later the closeout register cards. Design spec: Teisoro `docs/design/services-day/03-action-grid.md`.
Proposed API: `columns` (1–4), `columnsBelow` (`{ md: 1–4 }`), `gap` (spacing step), plus every `Box` prop (`as`, padding, visibility, HTML attributes).
Behavior and failure boundary: children stretch to their cell; column counts outside 1–4 throw a `RangeError`; the phone rule uses the existing `md` breakpoint token; no arbitrary column templates.

Scalewing owns the reusable layout, generated classes, tests, gallery evidence, and changeset. Teisoro owns what goes in the cells.
