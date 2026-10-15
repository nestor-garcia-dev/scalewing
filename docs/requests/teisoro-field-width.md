Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #187; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 2; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: `Field` `width`, a cap on a short field's control so it does not stretch across a form.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the settings and employee boards draw short values (a rate, a limit, a code) in boxes their own size inside a form column, and a Field's control always fills its column. Wrapping the Field in a sized Box would also squeeze its label and description; sizing the input in Teisoro would need app CSS or a width in JSX.
Existing surface this might already be: `Select width="full"` (the opposite: a listbox trigger that fills its column); `Grid` columns (fields side by side, each still filling its cell); `Stepper` (a count at its own width, not a typed value).
Workaround I almost used: a `Grid` of several columns with one cell filled, or an inline `style` width on the input.
Teisoro use: the store settings form (commission and limits) and the employee form (an hourly rate).
Proposed API: `Field width="sm"`, from a fixed set of sizes.

## Accepted API (2026-10-14)

- `Field` gains `width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (`FieldWidth`, `fieldWidths`): the Table column sizes, 4, 6, 8, 12 and 16 rem, shared with `DenominationGrid labelWidth`. Left out, the control fills its column (unchanged). An unknown width throws a `RangeError`.
- The cap is on the control alone: a native text input, select or textarea (a checkbox, radio, range, colour or file input keeps its size), or the frame of an adorned (`prefix`/`suffix`) or `variant="search"` field, measured by its border box, placed at the column's start and never wider than the column (`min(100%, width)`, and a resized textarea stays inside it). A `width` with no native control child throws a `TypeError`, as `prefix` does. The label, description and error keep the column's width.
- A sized select states its whole control height (md, or xs in a `size="xs"` field), since the canvas draws a select as a content box.
- New classes `sw-field-sized` and `sw-field-width-xs` … `sw-field-width-xl` (each sets `--sw-field-width`). No new tokens or dependencies.
- Field's prop checks move to `components/field/field-checks.ts`, so Field stays one responsibility.

No board figures are quoted here.

Evidence: `field-width.test.tsx` (unchanged by default, the classes on request for an adorned input and a select, the refusal, the generated rules and catalog); the existing Field tests unchanged with Field's prop checks moved to `components/field/field-checks.ts`; gallery "Field" (short fields at xs, sm, lg and an xs-size select at md); `apps/gallery/e2e/field-width.spec.ts` on desktop-en, mobile-es and forced-colors (each control at its cap or the column, a sized select at the field height and an xs one at the xs height, the description at the column's width, at the column's start, no sideways scroll at 390 px, light and dark).
