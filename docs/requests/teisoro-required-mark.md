Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.32.0 (PR #145; accepted 2026-10-11; Teisoro F-011 release R6 "canvas fidelity"; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `requiredMark` on the labelled form controls (`Field`, `Select`, `DateField`, `Combobox`, `FilterChips`): whether a required control's label draws " \*". An extension of those controls, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 boards label required fields without any mark (the amount, the reason, the company; a shortage note says "Required" in its placeholder instead). Scalewing draws " \*" after the label of every control passed `required`, so Teisoro either keeps the asterisk (unlike the boards) or drops `required` (and with it the native required state assistive technology announces). Teisoro owns no CSS.
Existing surface this might already be: `required` (draws the mark and sets the state together).
Workaround I almost used: leaving `required` off and setting `aria-required` on the native child by hand (Select, DateField and FilterChips have no such child to reach).
Teisoro use: every required field on the redesign.
Proposed API: `requiredMark?: 'visible' | 'hidden'` (generic: whether the required mark is drawn), one shared type across the five controls.

## Accepted API (2026-10-11)

- `requiredMark?: RequiredMark` (`'visible' | 'hidden'`, default `visible`, unchanged; `requiredMarks` exported) on `FieldProps`, `SelectProps`, `DateFieldProps`, `ComboboxProps` and `FilterChipsProps`. `hidden` leaves out the `sw-field-required` span; `required` still sets the native `required` (Field's child, DateField's entry, Combobox's input, each FilterChips radio) or `aria-required` (Select's trigger). The mark was always `aria-hidden`, so names do not change. Stepper never drew a mark and has no `required`.
- One shared rule (`showsRequiredMark` and `assertRequiredMark` in `FieldLabelText.tsx`); an unknown value throws a `RangeError`.
- No new generated classes.

Evidence: `required-mark.test.tsx` (all five controls draw the mark by default, none with `hidden` while each stays required or `aria-required`, the DateField entry still required, an unknown value throws on all five); gallery "Field" ("Ranger on duty") and "FilterChips" ("Weather", with a hint that says it is required); `apps/gallery/e2e/field.spec.ts` and `filter-chips.spec.ts` "Field requiredMark hidden…" on desktop-en, mobile-es and forced-colors (no asterisk, still required, the name unchanged, the default field still marked).
