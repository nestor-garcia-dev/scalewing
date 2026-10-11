Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.30.0 (PR #136; Teisoro F-011-S05, release R4 "ledger and navigation", item 18; the redesign inventory's row 5).
Renderer: react
Missing surface: `ButtonGroup` `attached`, buttons joined into one control.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the day title on about 12 boards (ServicesDayLedger2, LedgerFix1–3, Void*, Drawer*) moves between days with Previous, Today and Next joined in one rounded control with dividers. `ButtonGroup` is an action row with a gap that stacks full width on a phone; `SegmentedControl` is a choice (`radiogroup`), not three commands. Teisoro owns no CSS.
Existing surface this might already be: `ButtonGroup`, `SegmentedControl`, `Inline` of `Button`s.
Workaround I almost used: three separate `Button`s in an `Inline`.
Teisoro use: `DayTitle` (`DayNavigator.tsx`, `services-day/ServicesDayHeader.tsx`).
Proposed API (inventory): `ButtonGroup` `attached?: boolean` (one joined control).

## Accepted API (2026-10-11)

- `ButtonGroup` `attached?: boolean` (default `false`): the group's direct `Button` children side by side at one height (`align-items: stretch`) with no gap, each after the first pulled 1 px back so the borders overlap into single dividers, inner corners square and outer ones the `sm` radius (logical corners, so right to left mirrors it). A borderless variant (primary, tertiary, ghost, danger) draws its divider in its own text colour at 30%; forced colours draw every border. It keeps its row below `md` (the action row stacks there) and sizes to its buttons, even in a `Stack`, so `justify` does not apply. Still a `role="group"` named by `aria-label`; the buttons stay separate tab stops and commands.
- Focus and pressed: the group is its own stacking context (`isolation: isolate`) with a local order (`joinedControlOrder` in `css/stacking.ts`): a pressed toggle (`aria-pressed`) at 1 and the focused button at 2, so the button's standard outer focus ring (it meets the page, as everywhere) and the pressed ring paint over the neighbours instead of under them.
- Limits: give every button the same variant and size; a wrapper around a button (a tooltip's span, a menu trigger's box) is not joined. A disabled button keeps its 0.4 opacity, so its shared dividers read lighter.
- Generated class `sw-button-group-attached`.
- Sizes and looks on Scalewing's scale (Teisoro D-2): the buttons are the consumer's `Button`s, such as `variant="secondary"` at the default size (44 high; board 40) with their own fill and border, each a separate filled button (the board is one grey track, #e8e8ed, with transparent buttons and 1 px dividers at 0.12 alpha); outer radius `sm` 8 (board 10); "Today" in the button's label type 15/600 (board 13/600); the arrow buttons take whatever glyph the consumer passes and an `aria-label` ("Previous day").

Evidence: `button-group-attached.test.tsx` (the class, an action row unchanged, the generated rules: stretch, no gap, isolation, the overlap, the corners, the borderless divider, the pressed and focused raise with no inset offset, the row kept below `md`); `stacking.test.ts` (the joined order only inside the isolated group); gallery "ButtonGroup" ("Survey day": Previous, Today and a disabled Next with chevron glyphs; "Sighting view" List/Map toggles; "Count actions" in the primary variant); `apps/gallery/e2e/button-group.spec.ts` on desktop-en, mobile-es and forced-colors (one row of touching buttons at one height, square inner and rounded outer corners and their mirror right to left, the group as wide as its buttons on a phone too, the focused button raised with its outer ring, the pressed toggle raised, a 1 px divider between primary buttons).
