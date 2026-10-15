Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #194; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 9; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: two opt-in `Switch` options: the control after its label (a trailing layout), and a success colour while on.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the download sheet and the store settings boards set each switch at the end of its row, after its words and description, in green while on. `Switch` always puts its control before its label and fills it with the accent. Teisoro F-012-S17 and S20 list both as remaining differences (D-159).
Existing surface this might already be: `Switch` (leading, accent); `Checkbox` (a box, not a switch).
Workaround I almost used: a Teisoro row of `Text` and a `Switch` with a visually hidden label, which would split the label from the control's click target.
Teisoro use: the download sheet's two name switches and the settings' ring-into-the-POS switch.
Proposed API: `Switch layout="trailing"` and `Switch checkedTone="success"`.

## Accepted API (2026-10-14)

- `Switch` gains `layout?: 'leading' | 'trailing'` (`SwitchLayout`, `switchLayouts`), default `leading` (unchanged). `trailing` (`sw-switch-trailing`) renders the words first and the control last, so the reading order follows the drawing, in a row as wide as its column with the control at its end, a space-3 gap apart, the label's first line centred on the control.
- `Switch` gains `checkedTone?: 'accent' | 'success'` (`SwitchCheckedTone`, `switchCheckedTones`), default `accent` (unchanged). `success` (`sw-switch-success`) fills and edges the track with the success colour while on, 3:1 or more on the surface in every palette and scheme; forced colours keep `Highlight`.
- An unknown layout or tone throws a `RangeError`. The whole row stays the control's label (one click target). No new tokens or dependencies.

### Differences from the boards (Teisoro D-2)

- The track and thumb keep Scalewing's size; the green is the theme's success colour.

No board figures are quoted here.

Evidence: `switch-options.test.tsx` (the trailing order and classes, the description, a press, the default unchanged, the refusals, the generated rules with forced colours, the success track at 3:1 on the surface and the page background in every palette); the existing Switch tests unchanged; gallery "Switch" (two trailing success switches in a card); `apps/gallery/e2e/switch-options.spec.ts` on desktop-en, mobile-es, forced-colors and safari (the control at the row's end after the words, Space toggles it from the off fill to the success fill, or to Highlight in forced colours, the success track at 3:1 on the card in light and dark, no sideways scroll at 390 px), and `tab-order.spec.ts` unchanged.
