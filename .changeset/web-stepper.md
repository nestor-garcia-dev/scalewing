---
'@scalewing/react': minor
---

`Stepper` (with `StepperProps` and `StepperWidth`): a whole-number count changed with − and + or typed, the web counterpart of the react-native `Stepper` (`docs/requests/teisoro-stepper.md`, Teisoro F-011 release R1).

- `label`, `labelVisuallyHidden`, `value` (`number | null`), `onChange`, `min` (default 0), `max` (open when left out), `step` (default 1), `decrementLabel`, `incrementLabel`, `error`, `changed`, `disabled`, `readOnly`, `valueText`, `placeholder`, `name`, `width` (`'fixed' | 'full'`), and a ref to the input.
- The count is a native text input with `role="spinbutton"` and the one tab stop (ArrowUp and ArrowDown step it, Home and End go to `min` and a finite `max`); the − and + buttons are named pointer targets outside the tab order that keep focus where it was, all three in a `group` named by the label. − stops at `min`, + at `max`; an empty box counts as `min`.
- Typed text other than digits (and a leading minus when `min` is below zero) is refused; a typed count is reported as typed, even outside the bounds, for the consumer's `error`.
- New generated classes `sw-stepper`, `sw-stepper-full`, `sw-stepper-track`, `sw-stepper-button`, `sw-stepper-input`, `sw-stepper-invalid`, `sw-stepper-changed` and `sw-stepper-readonly`, sized from the `md` control height and spacing step 6. No new tokens or dependencies.
