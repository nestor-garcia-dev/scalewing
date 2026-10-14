Scalewing request from Teisoro.

Status: accepted 2026-10-14 (Teisoro F-012-S05, release M3 "periods, lists and figures", item 2; the manager views inventory's rows 13 and 30; plan approval under Teisoro decisions O-1, D-1, D-6 and D-9).
Renderer: react
Missing surface: web `ListGroup` and `ListRow`, the web counterpart of react-native 1.10.0's (`futmas-list-row.md`), with a bounded height and a pinned footer.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every report has "Worth a look" (a status dot, a bold title, one muted detail line, the row opens the source, a chevron) and "Went smoothly" (a check and a plain statement, no chevron) inside a Card with hairlines between rows. All 21 phone boards draw their lists the same way, many with a value and a note at the end ("+$1.48"), and a list with a total scrolls inside itself with the total pinned below it ("14 closeouts · the list scrolls · the total is all 14", Teisoro D-6). Table is for columns; a Card per row cannot draw one panel with hairlines; a `Box as="a"` row would rebuild the chevron, the pressed fill, the names and the bounded scroll in every report.
Existing surface this might already be: `Table` with `TableRow pressable` (columns, not a list of statements); react-native `ListGroup` / `ListRow` (native only; rule 9 forbids sharing it).
Workaround I almost used: a Teisoro `LookList` of `Box as="a"` rows with a Lucide chevron and its own hairlines.
Teisoro use: `LookList` (Worth a look and Went smoothly on every report) and `ReportTable` below `md` (every phone list, a list with a total bounded with its total in the footer).
Proposed API (inventory): `ListRow` `title`, `detail?`, `value?`, `valueDetail?`, `leading?` (the dot), `onPress?` (adds the chevron), `href?`; `ListGroup` `maxHeight?` and `footer?`.

## Accepted API (2026-10-14)

Same names and props as react-native's where they apply: `ListGroup` `variant` (`panel`, `plain`) and children; `ListRow` `title`, `detail`, `value`, `leading`, `onPress`, `selected`, `disabled`, `tone` (`default`, `danger`) and `accessory` (`chevron`, `none`). Native's `accessibilityLabel` is the web's `aria-label`.

- `ListGroup` (props `ListGroupProps`, a ref to its box): a `ul` (its list role kept for Safari) of rows with a hairline between each pair, named by `aria-label` or `aria-labelledby` (optional, as native).
  - `variant`: `panel` (default) is one bordered panel on the surface, rounded `md`; `plain` draws no panel and a hairline above the first row too, for rows inside a Card, with no inline padding.
  - `maxHeight?: { rows }` (a whole number from 1, as `Table maxHeight`): the list is as tall as that many rows of a title and one detail line (the row's padding twice, the title's line, the detail's line and the hairline); the rest scroll inside the shared scroll region, a named keyboard stop (`role="group"`, `tabindex="0"`), which shades its top or bottom while rows are past it (none in forced colours; printed, every row shows). A bounded list must be named.
  - `footer?`: pinned under the rows, outside the scroll, under a hairline, such as a `ListRow` with the count and the total. A `ListRow` there renders as a `div`, not a list item.
  - `className` and `id` reach its box.
- `ListRow` (props `ListRowProps`): the leading mark, the title over its detail, the value over its detail at the end, then the chevron or check, each lined up with the title's first line.
  - `title` (label size at weight 600; `titleAppearance="plain"` is the body weight, for a list of plain statements such as Went smoothly), `detail?` (muted caption), `tone?: 'default' | 'danger'` (the title in the danger colour).
  - `value?` (label size at weight 600, tabular figures), `valueDetail?` (muted caption under it; the end column never shrinks below its words, up to half the row, so the label takes the wrap) and `valueTone?` (`success`, `danger`, `muted`, `accent`: a table cell's tones); a `valueDetail` or `valueTone` with no value throws.
  - `leading?`: a consumer mark such as a status dot or a Lucide glyph (ADR 0008), hidden from assistive technology, so the words say what it means.
  - `onPress?` makes the whole row a `button`; `href?` makes it a link, where `onPress` takes a plain press (no modifier) for a client router, as `SectionNav`'s `onNavigate`. Either adds the chevron (the shared stroke, pointing to the inline end, mirrored right to left), a quiet fill under a hovering pointer (`hover: hover`, so a tap leaves none) and while pressed, an outline in `Highlight` under the pointer in forced colours, an inset focus ring, an explicit `tabindex` and 44 px on a coarse pointer. A pressable row is named by its title and value and described by its detail lines; `aria-label` replaces the name. A link row keeps the text colour over the canvas link rules.
  - `selected?` makes the row a choice: a check in the accent while true, nothing while false, with `aria-pressed` on a button and `aria-current="true"` on a link; it never shows a chevron. A `selected` row with neither `onPress` nor `href` throws, since nothing could read its state.
  - `accessory="none"` hides the chevron of a pressable row that acts in place.
  - `disabled` dims the row and blocks presses: a disabled button, or a link without its `href` (`aria-disabled`).
  - Without `onPress` or `href` the row only states something: no control, no chevron, its text in reading order.
- Shared, not copied: `plainPress` moves to `components/link-press.ts` (SectionNav and ListRow), the top and bottom edge shade to `blockEdgeShadeRules` in `css-scroll-region.ts` (a bounded Table and ListGroup), and the check's strokes to `checkStrokeIn` in `css/chevron.ts` (Checkbox, Steps and ListRow); their output is unchanged.
- Pure options in `list-options.ts` (`listGroupVariants`, `listRowTones`, `listRowTitleAppearances`, `listRowValueTones` and their types, `ListGroupMaxHeight`); unknown values, an empty title or value, a choice that is not pressable, a bad row count and an unnamed bounded list throw a `RangeError`.
- No new tokens, layers or dependencies. New classes `sw-list`, `sw-list-item`, `sw-list-group`, `sw-list-group-panel`, `-plain`, `-scroll`, `-footer`, and `sw-list-row` with `-pressable`, `-disabled`, `-leading`, `-label`, `-title`, `-title-plain`, `-title-danger`, `-detail`, `-end`, `-value`, `-value-<tone>`, `-value-detail`, `-chevron` and `-check`.

### Differences from react-native

- The web value is the text colour at weight 600 (the boards' figures), with `valueTone`; native's is muted. `valueDetail`, `valueTone`, `titleAppearance`, `href`, `maxHeight` and `footer` are web additions.
- The web check is a drawn stroke; native's is a "✓" character.

### Differences from the boards (Teisoro D-2)

- Plain rows put the hairline above the first row (native's rule) rather than under the last.
- The phone boards' bounded list shows about five and a half rows of two-line details; a row count bounds to whole rows of one detail line, so taller rows show fewer.

Evidence: `list-group.test.tsx` (the named list and its role, panel and plain, the bounded region and its row count, the footer's row outside the list, refusals; a row as a button named by its title and value and described by its details, a press anywhere on it, a link with a plain press for a router and a modifier press left to the browser, choices with a check and `aria-pressed` or `aria-current`, disabled rows, no chevron with `accessory="none"`, the danger title, an `aria-label` name, the accessory rule, the generated CSS); gallery "ListGroup" (Worth a look and Went smoothly in Cards, eight night counts bounded to four with the total pinned, a choice list, and a panel of values with a disabled and a danger row); `apps/gallery/e2e/list-group.spec.ts` on desktop-en, mobile-es and forced-colors (the description, a press on the detail line, a link in the text colour opened from the keyboard, choices, 44 px on a coarse pointer, no sideways scroll at 390 px, the bounded height, the shades as the region scrolls, the pinned total, marks and hairlines in forced colours, the value's note on one line at 390 px); `e2e/tab-order.spec.ts` (Tab through button and link rows, past a disabled row, in WebKit too).
