Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.32.0 (PR #143; accepted 2026-10-11; Teisoro F-011 release R6 "canvas fidelity"; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `Dialog` `appearance`: a banded sheet. An extension of `Dialog` (`teisoro-dialog-header-footer.md`, `teisoro-dialog-close.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 drawer sheets (DrawerAdd, DrawerAudit, DrawerAdjust, DrawerDrop, opened from the day's toolbar) are solid white sheets whose header (icon tile, title, description, a × in a grey circle) and footer (summary figure, Cancel, primary) are bands across the sheet's full width, ruled off from the body by hairlines. Scalewing's Dialog is one frosted glass panel whose header sits inside its padding with a ghost ×. Teisoro owns no CSS, and other products keep the glass panel.
Existing surface this might already be: `Dialog` `icon`, `description`, `closeLabel`, `footer` (the parts exist; the bands and the round close do not).
Workaround I almost used: a `Card` inside the dialog (a second frame inside the first).
Teisoro use: the drawer tools sheet (S24) and every count sheet opened over a page.
Proposed API: `appearance?: 'glass' | 'banded'` (generic: how the dialog's surface reads). The name avoids "sheet", which `sheetBelow` already uses for the bottom sheet.

## Accepted API (2026-10-11)

- `DialogProps.appearance?: DialogAppearance` (`'glass' | 'banded'`, default `glass`, unchanged; `dialogAppearances` exported).
- `banded`: the dialog's background is `--sw-color-surface` with no backdrop blur, a transparent border and `--sw-elevation-md`. The title row is always a row (a lone title too, so the band is drawn) that bleeds past the dialog's space-5 padding to its top and side edges, padded space-4 down and space-5 across, on the surface over a `--sw-color-border` hairline, and stays at the top while the content scrolls under it (sticky, on the `topChrome` layer of `stacking.ts`, under any popup), as the footer stays at the bottom. In a bottom sheet the band steps past the sheet's safe-area side padding, so its hairline meets both edges. The footer is unchanged (already a band). The close button is a circle (`--sw-radius-pill`) on `color-mix(in srgb, var(--sw-color-muted) 16%, transparent)` (24 % on hover where the pointer can hover; the same quiet fill as the open ActionMenu and Select rows) in the text color, inside the band's padding, keeping the sm square and the 44 px coarse-pointer target. Forced colors outline the dialog in CanvasText and keep the header hairline.
- The body stays on the surface: the boards' drawer sheets set their body white too (the sheet's own grey shows nowhere).
- Sizes (D-2): radius `lg` 24 (board 18), header padding 16/24 (board 18/22), body 16 below the band (the dialog's space-4 gap) and 24 at the sides (board 20/22), close 32 (board 32).
- An unknown value throws a `RangeError`. Generated class `sw-dialog-banded`, its rules in `css-dialog-banded.ts`, emitted after the frame rules.

Evidence: `dialog-banded.test.tsx` (default unchanged, the class, the header row with the close button that asks `onClose`, a lone title banded, the description, unknown throws, the generated rules and their order); gallery "Dialog" ("Move herons to the pond"); `apps/gallery/e2e/dialog-banded.spec.ts` on desktop-en, mobile-es (the bottom sheet) and forced-colors (solid surface, the band flush with the edges, the hairlines, the round filled close inside the band, the band still at the top after the content scrolls, close works; and the dialog and band on the surface in the dark scheme).
