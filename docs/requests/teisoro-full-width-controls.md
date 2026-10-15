Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #193; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 8; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: `fullWidthBelow` on `SegmentedControl` and on an attached `ButtonGroup` (fill a phone's width), and `SegmentedControl` `size="sm"` (labels kept on one line in a phone's card).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the phone boards stretch the period's quick choice (a raised switch) and the joined ‹ › steps across the screen, and the corrections board's switch with three counted labels sits on one line in a 390 card. A raised `SegmentedControl` and an attached `ButtonGroup` always size to their contents, and a segment's label wraps onto two lines when the track is squeezed. Teisoro F-012-S12, S16 and S19 list these as remaining differences.
Existing surface this might already be: `SegmentedControl variant="filled"` (equal segments that fill, but always, in the accent); `ButtonGroup` without `attached` (stacks full width on a phone, one button per row).
Workaround I almost used: a Teisoro wrapper with a width style, or shorter words on a phone only.
Teisoro use: `PeriodControl` (the quick choice and the steps on a phone), the corrections switch, and Risk management's switch.
Proposed API: `fullWidthBelow="md"` on both, and `SegmentedControl size="sm"`.

## Accepted API (2026-10-14)

- `SegmentedControl` gains `fullWidthBelow?: Breakpoint` (the layout breakpoint, `md`, as Dialog's `sheetBelow` and ActionBar's `stickyBelow`): below it the field fills its column and the track shares it equally among its segments (the filled track's grid), whatever the variant; from it up nothing changes (`sw-segmented-field-full-below-md`).
- `SegmentedControl` gains `size?: 'md' | 'sm'` (`SegmentedSize`, `segmentedSizes`), default `md` (unchanged). `sm` (`sw-segmented-sm`) pads each segment without a mark a space-2 step on both sides (a segment with a mark keeps its variant's padding) and keeps its label on one line, in its own box (`sw-segmented-item-label`) that ends in an ellipsis past its share on every variant; the radio's name keeps the whole label. Labels should fit: the ellipsis cannot be expanded.
- An attached `ButtonGroup` gains `fullWidthBelow?: Breakpoint`: below it the group fills its column and its buttons share the width (`flex: 1 1 0`, `sw-button-group-full-below-md`). On a group that is not attached it throws (that row already stacks full width on a phone).
- Unknown breakpoints and sizes throw a `RangeError`. No new tokens or dependencies.

### Differences from the boards (Teisoro D-2)

- The board's chosen segment and steps keep Scalewing's raised and attached looks; only their width changes.

No board figures are quoted here.

Evidence: `full-width-controls.test.tsx` (the classes on request and none by default, the whole label as the name, the refusals, the generated rules after the raised track's padding, the catalog); the existing SegmentedControl and ButtonGroup tests unchanged; gallery "SegmentedControl" (a small raised switch with counts in a card, and a small compact track with marks that fills a phone) and "ButtonGroup" (three joined tide steps); `apps/gallery/e2e/full-width-controls.spec.ts` on desktop-en, mobile-es and forced-colors (on a phone the track and the group fill their column with equal parts, from md up they keep their width, every label on one line, no sideways scroll at 390 px, light and dark).
