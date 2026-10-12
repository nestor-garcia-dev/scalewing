Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.32.0 (PR #150; accepted 2026-10-11; Teisoro F-011 release R6 "canvas fidelity", S17 shell; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `Box` `border="bottom"`: a hairline under a box only. An extension of `Box border` (`teisoro-box-border-style.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 boards put sub-bars (an area's section row, a day heading row) under the header as full-width white bands each with a 1 px hairline under it. `Box border` only draws all four sides; `Separator` is a separate rule element that does not belong to the bar's landmark. Teisoro owns no CSS.
Existing surface this might already be: `Box border` (four sides); `Separator`; `Tabs` (its strip hairline, tab semantics only).
Workaround I almost used: a `Separator` after each bar.
Teisoro use: the shell's sub-bars (S17).
Proposed API: `border?: boolean | 'dashed' | 'bottom'` on `Box`.

## Accepted API (2026-10-11)

- `BoxBorderValue` gains `'bottom'`: the generated `.sw-border-bottom` (solid 1 px `--sw-color-border` on the bottom edge, 0 elsewhere), emitted with the other box borders after the component rules, so it wins over a component's own frame at equal specificity, like `border` and `'dashed'`. A `style` still wins. Every Box-based component takes it.
- Forced colors keep it as a system border.

Evidence: `bar-surface.test.tsx` (the class, the rule); gallery "AppHeader" ("Herd sections" sub-bar); `apps/gallery/e2e/bar-surface.spec.ts` (1 px bottom only, the border token).
