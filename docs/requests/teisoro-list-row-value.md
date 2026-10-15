Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #190; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 5; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: two opt-in `ListRow` value options: a `warning` value tone, and a value drawn as a `Badge`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the phone boards' lists end some rows in a figure that needs a look (amber, not red) and others in a status pill (Open, Paid, Blocked) where the value goes. `ListRow`'s value tones are a table cell's four, without warning, and its value is text only, so a status pill would have to go in the title line or as the leading mark. Teisoro F-012-S14 and S19 list both as remaining differences.
Existing surface this might already be: `ListRow valueTone` (success, danger, muted, accent); `Badge` (the pill, but no place for it in a row's end); `StatTile tone="warning"` (a figure in a tile).
Workaround I almost used: a Teisoro row of `Box`, `Text` and `Badge` rebuilding the row's names and chevron.
Teisoro use: the phone lists of Registers, Services and Risk management (a warning figure; a status at the end).
Proposed API: `ListRow valueTone="warning"` and `ListRow valueBadge={tone}`.

## Accepted API (2026-10-14)

- `ListRow` `valueTone` gains `warning` (`listRowValueTones` is the table cell's four plus `warning`; `ListRowValueTone`). Its colour is the warning colour's ink, moved halfway to the text colour (`color-mix`, the share a chart's warning words use, `semanticInkShare`), because the warning colour alone falls under 4.5:1 on the surface in some palettes; the ink keeps 4.5:1 on the surface in every palette and scheme (`list-row-value.test.tsx`); under a pressable row's hover fill it stays above every other value tone. The other tones are unchanged.
- `ListRow` gains `valueBadge?: BadgeTone` (`neutral`, `accent`, `success`, `danger`, `warning`): the value's words are drawn in a `Badge` of that tone (md) at the row's end, still in the value's slot, so a pressable row is still named by its title and value. It needs a value and is never with `valueTone` (a `RangeError` otherwise); an unknown tone throws.
- No new classes besides `sw-list-row-value-warning`; no new tokens or dependencies.

### Differences from the boards (Teisoro D-2)

- The warning value is the warning ink, darker than the boards' amber.
- A status badge is Scalewing's outlined Badge, not the boards' filled pill.

No board figures are quoted here.

Evidence: `list-row-value.test.tsx` (the warning class and rule, the ink at 4.5:1 in every palette, a badge value naming a pressable row, the refusals); `list-group.test.tsx` updated for the new tone and message; gallery "ListGroup" (a warning figure and two status badges in the Station list); `apps/gallery/e2e/list-row-value.spec.ts` on desktop-en, mobile-es and forced-colors (the badge at the row's end, the warning value at 4.5:1 in light and dark, no sideways scroll at 390 px).
