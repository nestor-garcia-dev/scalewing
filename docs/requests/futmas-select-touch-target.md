Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.53.0 (accepted 2026-10-24; FutMas F-010-S13 "Layouts" row: Select triggers 44 px on a coarse pointer; standing owner approval).
Renderer: react
Missing surface: a 44 px touch target for every `Select` size on a coarse pointer, as `Button` got in 1.51.0 (`futmas-button-touch-target.md`). An extension of `Select`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the S13 inline division Select and PasteRows' column Selects are `size="xs"` (28 px) and FutMas cannot write media queries.
Existing surface this might already be: `Select size="md"` (44 px everywhere, too heavy in a table row on a laptop).
Workaround I almost used: `size="md"` on touch layouts.

## Accepted API (2026-10-24)

No new props. Under `(pointer: coarse)` `.sw-select .sw-select-trigger` and `.sw-select .sw-select-option` are at least `--sw-control-md-min-height` (44 px), after the size rules, which they outrank only by order. Type and padding stay the size's; a fine pointer keeps `xs` at 28 px. Open lists of an `xs` Select are taller on touch.

Evidence: `select-touch-target.test.ts` (the rule, its order after the size rules, the fine-pointer xs height); `apps/gallery/e2e/paste-rows.spec.ts` (xs Selects 44 px on mobile-es, 28 px on desktop-en); the full gallery suite passes.
