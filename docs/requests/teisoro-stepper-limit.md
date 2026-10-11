Scalewing request from Teisoro.

Status: accepted 2026-10-11 (Teisoro F-011 release R6 "canvas fidelity"; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `Stepper` `limitAppearance`: how − at `min` and + at `max` look. An extension of `Stepper` (`teisoro-stepper.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: on every F-011 count board (DrawerAdd, DrawerAudit, VaultCount1, PosClose1, the entry steps) the − beside an empty or zero count is drawn in the same grey as +, while Scalewing fades a button at its limit to 40 %, so a fresh count sheet shows a column of faded minus signs. Teisoro owns no CSS.
Existing surface this might already be: `disabled` (the whole Stepper), `readOnly` (hides the buttons).
Workaround I almost used: `min={-1}` (lets the count go negative).
Teisoro use: the `BillCount` composite's entry rows, through `DenominationGridEntry.limitAppearance`.
Proposed API: `limitAppearance?: 'faded' | 'plain'` (generic: how a button at its limit looks).

## Accepted API (2026-10-11)

- `StepperProps.limitAppearance?: StepperLimitAppearance` (`'faded' | 'plain'`, default `faded`, unchanged; `stepperLimitAppearances` exported). `plain` keeps − at `min` and + at `max` at full opacity with the default cursor. The button stays a disabled `button` (it was never a tab stop), so a press does nothing and assistive technology still hears it unavailable. A disabled or read-only Stepper is unchanged (the class is not set). Forced colors still draw a button at its limit in GrayText.
- `DenominationGridEntry.limitAppearance` passes it to every entry Stepper of the row.
- An unknown value throws a `RangeError`. Generated class `sw-stepper-limit-plain` in `css-stepper.ts`.

Evidence: `stepper.test.tsx` "Stepper limitAppearance" (default faded, plain at min still disabled and inert while + works, disabled and read-only unchanged, unknown throws, the generated rule and the forced-colors GrayText rule); `denomination-appearance.test.tsx` (the entry passes it through); gallery "Stepper" ("Ibises, − kept plain at 0") and the "Wading birds at the weir" grid; `apps/gallery/e2e/stepper.spec.ts` and `denomination-framed.spec.ts` on all three projects.
