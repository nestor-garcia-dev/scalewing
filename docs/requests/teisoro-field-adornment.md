Scalewing request from Teisoro.

Status: implemented for the react 1.9.0 release (Teisoro F-007-S03 task 1280; PR #62 reviewed and merged); pending consumer verification in Teisoro (task 1285).
Renderer: react
Missing surface: `prefix` and `suffix` on `Field`: short text inside the control's frame, before or after the value, that is not part of the value. Generated classes `sw-field-adorned`, `sw-field-prefix`, `sw-field-suffix`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Field` labels one native control, and the generated canvas draws that control's frame on the `<input>` itself. Text placed beside the input with `Inline` sits outside the frame, and putting "$" in the value breaks parsing. Teisoro owns no CSS or inline styles.
Existing surface this might already be: `Field` (this extends it). `DenominationGrid` and `StatTile` show consumer-formatted text, not an editable value. Native `Field` has no adornment either.
Workaround I almost used: a "$" `Text` in an `Inline` next to the input, "(USD)" in every label, or a "$" typed into the value.
Teisoro use: F-007-S03 task 1280, UX review finding UX-8 ("Money fields have no '$'", `docs/features/F-007-journey-suite-scale.in-progress/ux-reviews/closeouts-close-a-register.md`). The closeout form's amount fields (credit, debit, EBT, sales, taxes, dropped) are plain boxes next to count fields that take numbers of bills; each amount field renders `prefix="$"`.
Proposed API: `prefix?: string` and `suffix?: string` on `FieldProps`, for a single native `<input>` child:

```tsx
<Field label="Drop amount" prefix="$">
  <input inputMode="decimal" name="drop" />
</Field>
```

Behavior and failure boundary: presentation and naming only. The wrapper draws the canvas control surface (fill, hairline border, radius, focus ring on `:focus-within`, invalid border) and the input inside it drops its own frame, so the text and the value read as one control; the adornment is muted, never selected with the value, and never submitted. The adornment spans are `aria-hidden` so browse mode does not read them twice; the input's `aria-labelledby` lists the label, then the prefix, then the suffix, so it is announced as "Drop amount $". A child that names itself with its own `aria-label` or `aria-labelledby` keeps that name, and the prefix and suffix are added to its `aria-describedby` instead, so the unit is still read. The label still focuses the input, and so does a press anywhere on the frame (the prefix, the suffix or the padding under the text cursor); a press on the input itself keeps the browser's caret and selection. `size="xs"`, `labelVisuallyHidden`, `description`, `error`, and `required` keep working. An adornment on anything but one native `<input>` throws a `TypeError`: a select has its own chevron and a textarea has no single line to sit on. Formatting the value (two decimals on blur) stays with the consumer.

Scalewing owns the props, the generated classes, the tests, the gallery evidence (the Field section's "Wingspan", "Reserve entry fee" and compact "Canopy cover" fields, checked in `apps/gallery/e2e/field.spec.ts`) and the changeset. Teisoro owns the unit text, localized labels and value formatting, and adopts the release in task 1285.
