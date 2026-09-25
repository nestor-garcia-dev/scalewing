Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); not started.
Renderer: react
Missing surface: `Stepper` for the web renderer (the react-native `Stepper` from futmas-stepper.md has no web counterpart).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Get Change on Teisoro's closeout day has eleven count rows (straps of $1, $5 and $10, coin rolls, and six bills given back), each − count +. Teisoro composes a ghost − `Button`, an extra-small `Field` and a ghost + `Button` per row, which gives three tab stops, no shared accessible group or bounds, and a field width that shifts with the row. The change-orders dialogs (create, fulfill, targets, make deposit) use plain numeric fields for the same kind of count.
Existing surface this might already be: the react-native `Stepper`; `Field` with `inputMode="numeric"`.
Workaround I almost used: none beyond the composition above (`StepperRow` in app code).
Teisoro use: `apps/teisoro-web/src/app/closeout-day/GetChangeDialog.tsx` (`StepperRow`), and the count fields of `apps/teisoro-web/src/app/change-orders/`. Design: Teisoro `docs/design/vault/get-change.md` gap 1 and `docs/design/vault/change-orders.md` gap 2.
Proposed API: the react-native props (`label`, `value`, `min`, `max`, `step`, `onChange`, `valueText`) plus `error?: string` and typed entry: the count is an editable input between the buttons; − is disabled at `min` and + at `max`; the field has a fixed width.
Behavior and failure boundary: integers only; an unreadable typed value is reported through `error` by the consumer, and a button press on it restarts from `min`. The consumer formats amounts and owns the copy.
