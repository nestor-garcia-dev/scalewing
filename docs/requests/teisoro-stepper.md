Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.27.0 (PR #113; Teisoro F-011-S02, release R1 "guided-form core", item 1; the inventory's row 13). First requested by Teisoro F-002-S19 task 1060 (2026-09-25).
Renderer: react
Missing surface: `Stepper` for the web renderer (the react-native `Stepper` from futmas-stepper.md has no web counterpart).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Get Change on Teisoro's closeout day has eleven count rows (straps of $1, $5 and $10, coin rolls, and six bills given back), each − count +. Teisoro composes a ghost − `Button`, an extra-small `Field` and a ghost + `Button` per row, which gives three tab stops, no shared accessible group or bounds, and a field width that shifts with the row. The change-orders dialogs (create, fulfill, targets, make deposit) use plain numeric fields for the same kind of count. The F-011 redesign canvas puts the same "− count +" cell on 27 boards (EntryStep2, PosClose1, OpenDay1, VaultCount1 and every bill count), 44 px tall, with typed entry.
Existing surface this might already be: the react-native `Stepper`; `Field` with `inputMode="numeric"`.
Workaround I almost used: none beyond the composition above (`StepperRow` in app code).
Teisoro use: `apps/teisoro-web/src/app/closeout-day/GetChangeDialog.tsx` (`StepperRow`), the count fields of `apps/teisoro-web/src/app/change-orders/`, and, through `DenominationGrid` entry rows (`teisoro-denomination-grid-entry.md`), every count board of the F-011 canvas. Design: Teisoro `docs/design/vault/get-change.md` gap 1, `docs/design/vault/change-orders.md` gap 2, and `docs/design/redesign-2026-10/component-inventory.md` row 13.
Proposed API: the react-native props (`label`, `value`, `min`, `max`, `step`, `onChange`, `decrementLabel`, `incrementLabel`, `valueText`) plus `error?: string` and typed entry: the count is an editable input between the buttons; − is disabled at `min` and + at `max`; the field has a fixed width.
Behavior and failure boundary: integers only; an unreadable typed value is reported through `error` by the consumer, and a button press on it restarts from `min`. The consumer formats amounts and owns the copy.

## Accepted API (2026-10-11)

`Stepper` (props type `StepperProps`), a count changed with − and + or typed:

- `label: string` names the count (a visible label above it, or `labelVisuallyHidden` for a table cell named by its headers).
- `value: number | null` and `onChange(value: number | null)`: `null` is an empty box ("none"), which the consumer may show with `placeholder`.
- `min?: number` (default `0`), `max?: number` (no upper bound when left out), `step?: number` (default `1`): integers, `min <= max`, `step > 0`, or a `RangeError`.
- `decrementLabel: string` and `incrementLabel: string`: the buttons' names (product copy, such as "One less" and "One more").
- `error?: string` (a polite message under the control, `aria-invalid`, the danger border), `changed?: boolean` (`Field`'s changed look: the accent border and tint, for a value someone changed or a suggestion), `disabled`, `readOnly`, `valueText`, `placeholder`, `width?: 'fixed' | 'full'` (default `fixed`; `full` fills its container, for a table cell), and a ref to the input.

Behavior:

- The count is a native text input with `role="spinbutton"`, `inputmode="numeric"`, `aria-valuemin`/`aria-valuemax`/`aria-valuenow`, and the one tab stop: ArrowUp and ArrowDown step it, Home goes to `min` and End to a finite `max`. A range below zero takes `inputmode="text"`, since a phone's numeric pad has no minus key. The − and + buttons are pointer targets outside the tab order (the WAI-ARIA spin button pattern), named by `decrementLabel` and `incrementLabel`, and a press on one keeps focus where it was. The input and the buttons sit in a `group` named by `label`.
- Typed entry accepts digits only (and a leading minus when `min` is below zero): any other keystroke or paste is not taken, so the box never holds an unreadable value. A typed count is reported as typed, even outside `min`..`max`, so the consumer can say why in `error`; the buttons then move it back inside the bounds. The box shows the typed text while it means the same count (so "007" stays while typing) and the plain count after it loses focus.
- An empty box counts as `min` for the buttons: − is disabled and + gives `min + step`.
- `readOnly` keeps the count focusable and readable, and hides the buttons without moving the input (so read-only and editable steppers line up). `disabled` disables all three.
- Generated classes `sw-stepper`, `sw-stepper-track`, `sw-stepper-button`, `sw-stepper-input`, `sw-stepper-full`, `sw-stepper-invalid`, `sw-stepper-changed`, `sw-stepper-readonly`. Sizes from tokens: the `md` control height (44), buttons at spacing step 6 on the subtle fill, the count in body size at label weight with tabular figures. No new tokens.

Deviation from the original proposal: an unreadable typed value is refused at the keystroke rather than reported for the consumer to flag, so `onChange` only ever receives a whole number or `null`.
