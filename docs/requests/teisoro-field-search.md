Scalewing request from Teisoro.

Status: accepted 2026-10-11 for the `@scalewing/react` 1.31.0 release (Teisoro F-011-S06, release R5 "search", item 20; the redesign inventory's row 25). The web twin of the native search field (`futmas-search-field.md`); no code is shared (AGENTS.md rule on renderers).
Renderer: react
Missing surface: `Field` `variant="search"`: a search box with a leading glyph and a clear button.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: five boards (StepCheck1a, StepCheckSaved, NsfPay1, NsfPaySaved, NsfFromCheck) open the customer step with a name search: a glyph at the start, no label above (the input names itself), over a results table. The web `Field` draws a visible label above a plain control, adornments are text only (`prefix`, `suffix`), and nothing clears the text. Teisoro owns no CSS.
Existing surface this might already be: `Field` with `prefix` (text, not a glyph), the native `Field` `variant="search"` (react-native only), `Combobox` (R5, a list of suggestions; this is a filter over a table).
Workaround I almost used: `Field labelVisuallyHidden` with a "⌕" prefix and a separate clear `Button`.
Teisoro use: `CustomerSearch` (rebuilt), StepCheck1/1a, NsfPay1, NsfFromCheck.
Proposed API (inventory): `Field` `variant="search"` (web twin of `futmas-search-field.md`: leading glyph slot, clear button).

## Accepted API (2026-10-11)

- `Field` `variant?: FieldVariant` (`'outlined' | 'search'`, default `outlined`; `fieldVariants` exported).
- With `search`, one native `<input>` child with a controlled `value` (an uncontrolled input throws), and:
  - `clearLabel: string` (required, nonempty): the clear button's name ("Clear search").
  - `onClear: () => void` (required): the clear button's action; the consumer empties the value. Focus goes back to the input.
  - `leading?: ReactNode`: the consumer's glyph at the frame's start (Lucide `Search`), `aria-hidden`; a press on it focuses the input.
- The label element is not drawn (`sw-sr-only`, out of the flow, so the gap still sets a description or an error off the frame) and still names the input; the input becomes `type="search"` (a `searchbox`) with `enterKeyHint="search"` unless the consumer passes one. Escape with text calls `onClear` (the one clearing path; the browser's own Escape clear is prevented).
- The clear button shows while the input holds text and is enabled and not read-only; a press on it keeps focus in the input (no blur), focus goes to the input before `onClear` runs, and while it has keyboard focus only its own ring shows. It is a muted disc with a cross in the surface colour, in an `xs` control square (44 px wide on a coarse pointer) at the frame's end; the browser's own clear button and search decoration are hidden, so there is one. In forced colours the disc keeps `ButtonText` with a `ButtonFace` cross.
- The frame is the adorned field's (`sw-field-adorned`): control surface, focus ring, `error`, `description`, `invalid` and the disabled look as on any field.
- Failure boundary: a search field without a nonempty `clearLabel` (`RangeError`) or `onClear`, with `prefix` or `suffix`, or with a child that is not an `<input>` (`TypeError`); `leading`, `clearLabel` or `onClear` on an outlined field (`TypeError`); an unknown `variant` (`RangeError`).
- Generated classes `sw-field-search-field`, `sw-field-search`, `sw-field-search-leading`, `sw-field-search-clear`, `sw-field-search-cross`.
- Differences from the native twin (`futmas-search-field.md`): native is a filled `subtle` capsule with no hairline at rest, clears through its own `onChangeText('')` and sets `returnKeyType="search"`; web keeps the adorned control surface with its hairline and the `sm` radius (the web boards' look), clears through a separate `onClear` (the consumer owns the native input's `onChange`), and sets `enterKeyHint="search"`. `size="xs"` works on the web (the compact frame and padding).
- Sizes and looks on Scalewing's scale (Teisoro D-2): the frame is the md control, 44 high (board 48), the `sm` radius 8 (board 10), the control surface with its hairline (board white with no hairline at rest), the focus ring outside the frame (board a 2 px inset accent border), body type at the canvas size (board 17), the glyph a `space-2` (8) gap from the text (board 10); the boards show no clear button, the inventory and the native twin ask for one.

Evidence: `field-search.test.tsx` (the searchbox, its hidden label and `enterkeyhint`, the hidden glyph, the description, clearing and focus, no clear button when empty, disabled or read-only, Escape through `onClear`, the frame's mouse handling, a text type overridden, an error, the failures including an uncontrolled input, the generated rules); gallery "Field" ("Search birds" over a list, a disabled search with a description, a compact one with an error); `apps/gallery/e2e/field.spec.ts` on desktop-en, mobile-es and forced-colors (the value, the hidden glyph, 44 high, the clear button ending the frame and 44 wide on a phone, the disc and its cross apart, clearing with focus back and the list restored, typing bringing it back, a press on the glyph focusing the input, Escape clearing, the clear button at the inline end right to left, the disabled field without a clear button and its description set off by the gap, the compact field's error).
