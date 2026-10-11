Scalewing request from Teisoro.

Status: accepted 2026-10-11 for the `@scalewing/react` 1.29.0 release (Teisoro F-011-S04, release R3 "identity", item 12; the redesign inventory's row 7). Refiles the icon follow-up in `teisoro-segmented-control.md`.
Renderer: react
Missing surface: `SegmentedItem.icon`: a consumer mark before an item's label.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: 26 F-011 boards (Entry*, StepCheck*, Nsf*, CompanyLookup, LedgerFix2b, SignInIdle) switch services with a segmented control whose items are a coloured tile and a name ("Cash check", "Money transfer"…), the selected one white and raised on a grey track, 40 high. An item's `label` takes a node, so a consumer could put a tile in it, but the tile would be part of the radio's accessible name, the gap and centring would be the consumer's, and the compact item (28 high, caption type) cannot hold a 24 tile with room.
Existing surface this might already be: `SegmentedItem.label` as a node; `SegmentedControl variant="filled"` (equal widths, accent fill: the wrong look for a switcher).
Workaround I almost used: `label={<Inline gap={2}><GlyphTile/>Cash check</Inline>}`.
Teisoro use: the `ServiceSwitcher` composite (asks before switching when anything is typed) on every entry form.
Proposed API (inventory): `SegmentedItem.icon?: ReactNode` (the GlyphTile goes before the label). Taller selected segment at the `md` control height.

## Accepted API (2026-10-11)

- `SegmentedItem.icon?: ReactNode`: rendered before the label in `sw-segmented-item-icon`, `aria-hidden`, so the radio is named by its label alone.
- When any item has an icon the track takes `sw-segmented-with-icons`: every item is the `md` control height (44) with label type (15/20), the mark and label a `space-2` gap apart and centred; the track is the `subtle` fill and the selected item the surface raised by the small elevation (as the boards' grey track and white raised segment). In forced colors the track has a `CanvasText` edge and the selection a `Highlight` outline. A track without icons is unchanged.
- Keyboard, roles and `onChange` are unchanged (a `radiogroup` of `radio`s, arrow keys move the choice).
- Sizes on Scalewing's scale (Teisoro D-2): items 44 (board 40), a pill track and pill items (the board's 12 and 9 radius), every label 15 at weight 600 (the board's 15/500 unselected and 16/700 selected: the selection reads by the surface, the raise and the text colour), tile `GlyphTile size="sm"` 24 (board 24), unselected labels in `muted` (board #3a3a3c), the track `subtle` (#F2F2F5 in the default light theme; board #e8e8ed), a 2 track inset (`trackInset`; board 4), and a `radiogroup` with radios (the board marks up a `tablist`; a filter of one list is a choice, not tabs). The selected surface against the subtle track is 1.12:1 in the default light theme and 1.01 to 1.05 in sunburst, postcard and mocha (the board's white on #e8e8ed is 1.22), so there the selection is carried by the small elevation and by the text colour (text against muted). A filled track with icons keeps the filled look and only gains the marks. An icon track keeps the error outline and the disabled look. `labelVisuallyHidden` (icon-only) is not built.
- Generated classes `sw-segmented-with-icons`, `sw-segmented-item-icon`.

Evidence: `segmented-icon.test.tsx` (the hidden mark before the label, the radio's name, a track without icons unchanged, the generated rules, the error outline restated after the icon track in normal and forced colours, the reduced-transparency precedence, a filled track with icons, a disabled icon track); gallery "SegmentedControl" (the "Survey" switcher with GlyphTiles); `apps/gallery/e2e/segmented-control.spec.ts` on desktop-en, mobile-es and forced-colors (the mark hidden and before the label, within 2px of the row's centre, at least 44 high, click and arrow keys; the disabled and error icon tracks, with the danger border).
