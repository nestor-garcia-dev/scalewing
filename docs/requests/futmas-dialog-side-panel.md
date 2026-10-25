Scalewing request from FutMas.

Status: accepted for `@scalewing/react` 1.53.0 (2026-10-24; FutMas F-010-S13, board C4 Add teams, the S13 plan's "Scalewing gap list" row 2; standing owner approval).
Renderer: react
Missing surface: a side sheet: `Dialog placement="end"`. An extension of `Dialog`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Dialog` is centred or a bottom sheet only, and FutMas cannot position a top-layer dialog.
Existing surface this might already be: `Dialog size="lg"` centred; AppShell's drawer (private, inline start).
Workaround I almost used: `ui/SideSheet.tsx`, a centred `Dialog size="lg"`.

## Proposed API (S13 plan)

`Dialog placement="end"`: a full-height panel at the inline end (width `md`/`lg`), the same title row, close button, scrolling body and pinned footer; `sheetBelow` unchanged.

## Accepted API (2026-10-24)

The plan's API. `placement?: 'center' | 'end'` (default `center`; `dialogPlacements`, `DialogPlacement` exported).

- From md up (`sw-dialog-end`): the window's full height at the inline end, the `size`'s width capped to leave a space-8 strip of backdrop, square corners, one hairline on its inline-start edge (CanvasText in forced colours), the footer on the bottom edge even with short content, a slide in from its edge unless reduced motion.
- Below md: nothing changes; it is the centred dialog, or the bottom sheet with `sheetBelow="md"`.
- Same modal behaviour as Dialog: native focus trap, Escape and backdrop presses ask `onClose`, focus returns to the opener, `closeLabel` first focus.
- The fill is the appearance's: glass by default, the solid surface with `appearance="banded"` (closest to the board).
- Failure boundary: an unknown placement throws a `RangeError`.

### Classes

`sw-dialog-end`.

Evidence: `dialog-end.test.tsx`; gallery "Dialog side panel" (glass and banded); `apps/gallery/e2e/dialog-end.spec.ts` on desktop-en, mobile-es and forced-colors (full height at the right edge, 32rem, footer on the bottom edge, square corners and hairline, focus on Close, Escape returns focus, the phone's bottom sheet); the existing `dialog*` specs pass.
