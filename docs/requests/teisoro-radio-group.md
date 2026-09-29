Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S05 task 540; pending review and packed-consumer verification.
Renderer: react
Missing surface: `RadioGroup`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: SegmentedControl works for short button toggles but its compact horizontal presentation does not fit longer vertical form options. A raw radio group would require product control styling.
Existing surface this might already be: SegmentedControl.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: NSF payment and record forms plus vault audit resolution.
Proposed API: legend, value, onChange, options (value, label, disabled), description, error.
Behavior and failure boundary: Use native grouped radio inputs with a shared name, one selected value, and correct keyboard behavior. Keep business option values and localized labels in Teisoro.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1350): a glyph per option

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
Source: Teisoro UX re-review `services-check-cashing.md`, finding CHK-13 (partly fixed, the Scalewing part). The check-cashing company choice is still `group "Select company"` with `button … [pressed]` toggles, "which task 1325 leaves because Scalewing's `RadioGroup` takes text-only options". The first review's suggested fix was a real radio group with the name and the type glyph in each option.

Teisoro use: the check-cashing form's check type, personal or company (`apps/teisoro-web/src/app/check-cashing/ChecksSection.tsx`), each with a Lucide glyph (a person, a building) beside the words.

Proposed and implemented API (optional, no default change): `RadioGroupOption` gains `icon?: ReactNode`. When set, it renders in `<span aria-hidden="true" class="sw-radio-group-icon">` between the radio's mark and the label text, inside the option's `<label>`: in the text color (`currentColor` for a stroked glyph), centred on the label line, spaced by the option's own gap. The radio's accessible name stays the `label` text, because the glyph is hidden, even when it carries a `<title>`; a press on the glyph chooses the option as the words do. A disabled option fades its glyph with the rest of the option. In forced colors the glyph follows the forced text color.

Rejected alternatives:

- `label: ReactNode`. The label is also the option's accessible name, and it is the text the gallery, tests and the consumer find the option by; a node would let the name drift from the words (or carry the glyph's title into it) and make an empty name possible. A separate slot keeps `label` a string.
- A card-style option with a description and a badge (the first review's fuller suggestion). Teisoro's re-review asks only for the glyph; a description line can come as its own prop when a consumer asks for it.
- Keeping pressed `Button` toggles. They are not a radio group: no arrow keys between choices, no single tab stop, and each is announced as a toggle button rather than one choice of two.

Evidence: `radio-group.test.tsx` ("RadioGroup option icons": the radio's name is the label even with an `svg` `<title>` in the glyph, the slot is `aria-hidden` and sits between the control and the text, an option without an icon has no slot, and a press on the glyph chooses the option; the generated slot in the text color and its catalog class); `apps/gallery/e2e/radio-group.spec.ts` "RadioGroup options show a glyph beside the label, named by the label" on desktop-en, mobile-es and forced-colors (emulated), with the gallery's new "Sighting source" (Field observer, Camera trap, drawn with the gallery's one shared `Glyph`, which the Toast, StatTile and DenominationGrid sections now use too instead of their own copies): exact names, the hidden glyph visible between the mark and the words and centred on the label line, the same color as the words, and a press on the glyph checks "Camera trap".
