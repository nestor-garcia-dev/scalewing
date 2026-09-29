Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25). `error` is released in `@scalewing/react` 1.12.0 (the 2026-09-28 placeholder follow-up below); `disabled` is not started.
Renderer: react
Missing surface: `Select` `disabled` and `error` props.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Select` takes `label`, `options`, `value`, `onChange`, `size` and an optional `action`, but no way to show the choice as fixed or as invalid. `Field` has both (its validation props came from teisoro-field-validation.md), so a form that mixes text fields and selects reports errors two ways. Teisoro's vault Remove Cash dialog opens locked to one type for the monthly commission, and its Add Cash, Remove Cash, Edit movement and Resolve variance dialogs must say "Choose a source or reason." or "Choose a category." under the select after a first submit.
Existing surface this might already be: `Field` `error` and `disabled` (text inputs only); `DetailRow`-style `Text` pairs for a fixed value.
Workaround I almost used: none in Scalewing. Teisoro renders the locked type as a label/value detail row with a lock notice instead of a select, and the error as an alert `Text` under the select, with no `aria-invalid` or `aria-describedby` on the combobox.
Teisoro use: `apps/teisoro-web/src/app/vault-page/MovementDialog.tsx` (source or reason, the commission lock), `RecategorizeDialog.tsx` (category), `ResolveDialog.tsx` (resolution category), and the Period select on the vault page. Design: Teisoro `docs/design/vault/README.md`, Scalewing gap 1.
Proposed API: `disabled?: boolean` (the trigger is `aria-disabled`, stays focusable so the value is read, and does not open; the value keeps full contrast) and `error?: string` (rendered and wired as `Field` does: `aria-invalid`, the message linked by `aria-describedby`, the danger tone on the border and message).
Behavior and failure boundary: presentation and accessibility only; the consumer decides when a value is invalid and supplies the localized message. An empty `error` string is treated as no error.

Scalewing owns the props, tests and gallery evidence. Teisoro owns the copy and when it shows.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): the closed trigger

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-drawer-cash-and-audits.md`, finding DRW-12 (polish, the Scalewing trigger part).

In the drawer adjustment dialog's reason `Select`, the closed trigger's text sat near the top of its 44 px box (`.sw-select-trigger` was `inline-flex` with no `align-items`), its caret was two gradient triangles unlike the `Accordion` chevron, and the box grew from about 183 px to 343 px once a reason was chosen (`width: max-content` sized it to the current label).

Behavior:

- The trigger centres its text (`align-items: center`) and ends in the `Accordion` chevron, pointing down: a `::after` drawn from `chevronStroke`, which `css/chevron.ts` now shares between the two (`Accordion`'s marker output is unchanged apart from declaration order). Forced colors draw it in `CanvasText`.
- The trigger is as wide as its longest option, as a native select is: its text sits in `.sw-select-value`, a one-cell grid holding the current label (`.sw-select-value-text`) over one hidden `.sw-select-value-sizer` per option, whose label is drawn from `data-label` by `::before`. The copies are `aria-hidden`, invisible and not text content, so the trigger's text and accessible value are only the current label. Past the available width (`max-width: 100%`) the label ellipsizes.
- `Select.tsx` split its listbox (`components/select/SelectListbox.tsx`) and trigger text (`SelectValue.tsx`) out before growing.

No API change.

Rejected alternatives:

- A `width="full"` prop (the review's other option). Sizing to the longest option removes the jump without making each consumer choose; a full-width select in a form can be added later if a consumer needs it.
- Rendering the hidden labels as real text. The trigger's text content would then include every option, which changes what tests and assistive technology read.

Evidence: `select.test.tsx` ("sizes the closed trigger to its longest option without adding text"); `css/stylesheet.test.ts` (centred trigger, the stroked chevron, no gradient, the `data-label` sizer, new classes); `apps/gallery/e2e/select.spec.ts` "Select keeps its width when the value changes and centres its text" on desktop-en, mobile-es and forced-colors with the gallery's new "Survey reason" select: the text's middle is within 1 px of the trigger's, the caret is a 2 px stroked `::after` with no background image, the width is unchanged after choosing the longest reason, and the trigger stays inside the section on a phone (ellipsized).

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): `placeholder`, `required` and `error`

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-drawer-cash-and-audits.md`, finding DRW-12 (polish): "Add a `placeholder` prop, so 'Choose a reason' shows in the closed trigger but is not an option. Add `required` and `error`, as `Field` has, so the reason error sits on the control." Teisoro's `AdjustmentDialog.tsx` passes `{ value: '', label: text.choose }` as the first option today.

Proposed and implemented API (all optional, no default change):

- `placeholder?: string`: shown in the closed trigger, muted (`.sw-select-placeholder`), while `value` matches no option. It is not in the listbox, no option is `aria-selected` while it shows, it never reaches `onChange`, and it is one of the trigger's sizers, so choosing a value does not resize the trigger. A blank placeholder throws a `RangeError`. Without it, a `value` that matches no option still shows the first option's label, as before.
- `required?: boolean`: the label ends in `Field`'s `aria-hidden` mark (`sw-field-required`), and the trigger gets `aria-required="true"`.
- `error?: string`: a `sw-field-error` message under the control, linked by the trigger's `aria-describedby`, with `aria-invalid="true"` and a danger border (`.sw-select-invalid`, `Mark` in forced colors). Like every field error it lives in a polite live region that is always rendered, empty without an error, so a new error is announced once, politely, and never as an alert (see `teisoro-field-validation.md`, 2026-09-28). An empty string is no error.

The Select's open state and keyboard model moved into `components/select/use-select-list.ts` so `Select.tsx` stays one rendering responsibility (162 lines).

Rejected alternatives:

- A `description` prop in the same change. No consumer asked for it on `Select` yet; it can reuse the same message slot when one does.
- Keeping the placeholder as a disabled first option. It would still be in the list, where the review found it confusing, and a listbox option that cannot be chosen adds a stop for keyboard users.

Evidence: `select.test.tsx` ("shows a placeholder that is not an option until a value is chosen", "marks a required select and wires its error as Field does", "rejects a blank placeholder"); `css/stylesheet.test.ts` (placeholder and invalid rules, classes); `apps/gallery/e2e/select.spec.ts` "Select shows a placeholder, a required mark, and an error described on its trigger" on desktop-en, mobile-es and forced-colors, with the gallery's "Visit reason": the trigger reads "Choose a reason", has `aria-required` and the `*`, the polite error region exists empty before "Log visit" and holds the error after it, which sets `aria-invalid` and the accessible description with no `alert` and a danger border, the list has only the three reasons, and choosing one clears the error without changing the trigger's width.

## Follow-up (2026-09-28, Teisoro F-007-S05 task 1350): the label row matches Field's

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
Source: found while fixing Teisoro's NSF-35 for `DateField` (`teisoro-date-field.md`, 2026-09-28 label row follow-up). The same measurement in the gallery showed `Select`'s label row at 20 px, where `Field`'s is 25 px, so a `Select` beside a `Field` sat 5 px higher. The cause is the same: `Select` rendered its label as `<Text as="label" variant="label">`, with the label type on the `<label>` itself, while `Field`'s `<label>` keeps the canvas's body type around a label-size span.

Behavior (no API change): `Select` draws its label with `FieldLabelText`, the internal component that `Field` and `DateField` use (the label words as a `Text` label span, or a caption span at `size="xs"`, then the `aria-hidden` required mark), inside a plain `<label htmlFor id>`. The label rows are the same height, so a `Select` beside a `Field` lines up at the label and the control. `labelVisuallyHidden` now hides the span inside the label, as `Field` does; the label still takes no row. The trigger's `aria-labelledby`, its accessible name and the label's `htmlFor` are unchanged.

Consumer note (also in the changeset, per AGENTS rule 12): the `<label>` no longer carries `sw-text-label` or `sw-sr-only`; the span inside it does, so selectors on `label.sw-text-label` move to the label element or the span. A visible `size="xs"` label row goes from 18 px to 25 px, as tall as a visible `xs` `Field` label row. A visible `md` row goes from 20 to 25 px. A hidden label still takes no row.

Rejected alternative: setting the Select label's `line-height` to the body's. It matches only while the two fonts keep their sizes; sharing the markup keeps them equal by construction, as for `DateField`.

Evidence: `select.test.tsx` ("Select label row": the Select label's markup equals a required `Field`'s with its own words, the label has no class of its own, and the trigger is still labelled by it); the existing Select tests unchanged, including the visually hidden `xs` label; `apps/gallery/e2e/select.spec.ts` "a Select beside a Field lines up its label and control" on desktop-en, mobile-es and forced-colors, with the gallery's new required "Survey plot" beside a required "Plot size" field: the trigger's and the field frame's tops, and the label text tops, are within 0.5 px, the label rows are the same height, and the hidden "Compact range" label is at most 1 px tall.

## Follow-up request (2026-09-29, Teisoro F-007-S05 task 1355): `width="full"`

Status: implemented on `claude/select-width-full`, in review; not released. Teisoro pins it once `@scalewing/react` releases it.
Source: Teisoro F-007-S05 task 1355. Teisoro's phone filter is a `Select` labelled "Show" above a list of full-width cards. Since 1.12.0 the trigger is as wide as its longest option (the sizer grid above), so on a 390 px phone the filter is about 225 px wide beside cards that fill the row, and `Select` has no prop to fill it. The 2026-09-28 closed-trigger follow-up rejected `width="full"` until a consumer needed it; this is that consumer.
Existing surface this might already be: none. No Scalewing web component has a width prop (`Button`, `Field`, `SegmentedControl` and `DateField` have none: `Field` fills its column by default, and `SegmentedControl`'s full-width track is its `filled` variant, which also changes its look). The `sw-full-width` layout utility is a class on a Box, not a Select prop, and cannot reach the trigger. So there is no convention to follow; the name and values are the ones the closed-trigger follow-up proposed, and `'content'` names the default.

Proposed and implemented API (optional, no default change):

- `width?: 'content' | 'full'` (exported as `SelectWidth`), default `'content'`: today's field, as wide as its longest option, unchanged.
- `'full'` adds `sw-select-full` to the field. The field (`width: 100%`) and its trigger (`width: 100%`) fill the container's inline size. The value keeps the free space and ellipsizes past it, and the chevron stays last, at the inline end (on the left right to left). In an `Inline` row, `.sw-inline > .sw-select-full { flex: 1 1 0; min-width: 0 }` makes the field take only the space its siblings leave, so a `Button` beside it keeps its label on one line (with `width: 100%` alone the field's flex basis was the whole row and the button's label wrapped). The open list is exactly the trigger's width (`width: 100%` of the control; its `min-width: 100%` already beats the `--sw-dialog-max` cap), so on a phone it never runs past the screen's edge and a long option wraps inside it; `overflow-wrap: anywhere` on a full field's options breaks a single word longer than the list, which otherwise scrolled the list sideways. It opens from the trigger's inline start as before, so it lines up right to left. Forced colors need no new rule.

Rejected alternatives:

- `fullWidth?: boolean`. A boolean cannot name the default, and a later value (such as a fixed field width) would need a second prop.
- A full-width list sized to its longest option (`min-width: 100%` only). At a full-width trigger any option longer than the column runs past a phone's edge.
- Saying a full Select fills its container "as a text `Field` does". `Field` is a block, while a full Select in an `Inline` takes only the leftover space, so the comparison was dropped from the docs.
- Wrapping the Select in a `Box className="sw-full-width"` in Teisoro. It widens the field but not the `inline-flex` trigger, and Teisoro owns no CSS.

Evidence: `select.test.tsx` ("fills its container with width full and keeps content width by default": no extra class by default or with `'content'`, `sw-select-full` with `'full'` (with `xs`), the same trigger, and the open list inside the full field); `css/stylesheet.test.ts` (the `sw-select-full` rules for the field, trigger and list, the `Inline` flex rule and the options' `overflow-wrap`, the field rule after `.sw-select` so it wins, the class in the catalog); `apps/gallery/e2e/select.spec.ts` "Select width full fills its column, its list and its chevron follow" on desktop-en, mobile-es and forced-colors (emulated), with the gallery's new three-column Grid (one column below md): "Show" in a Stack above a Card, "Cell habitat" as a bare Grid cell, and an Arabic "الموطن" in a right-to-left cell. For each, the trigger is its grid track's width within 0.5 px (and the grid's full width on mobile-es), the chevron ends at the trigger's inline-end content edge within 1 px (the left edge right to left), and the open list is the trigger's width within 0.5 px either way, starts at its inline start and stays on screen. Choosing "Migration counts across the wetland reserve and the tidal flats" keeps the width, the text ellipsizes inside the trigger (its `scrollWidth` exceeds its `clientWidth`), and reopened, that option wraps to more than one line. "Select width full wraps a long word in its list instead of scrolling it sideways": the "Cell habitat" list's one-word option "Wattenmeernationalparkschutzgebietsvogelbestandserfassung" is taller than one line and the list's `scrollWidth` is at most its `clientWidth`. "Select width full in an Inline takes the space a Button beside it leaves": the gallery's `xs` "Sighting filter" beside a `sm` "Log a new sighting" Button; the button's label is on one line and the field, gap and button add up to the row within 1 px. Each spec fails without its rule: without the trigger rule the trigger was 174 to 241 px; without `overflow-wrap` the long word's option stays one line; without the `Inline` rule the button's label wraps to two lines.
