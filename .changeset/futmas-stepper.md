---
'@scalewing/react-native': minor
---

Add `Stepper`, a labeled bounded number between raised round minus and plus
buttons on a glass pill track that fills its column, so several can share a
row (see `docs/requests/futmas-stepper.md`). Props: `label`, `value`,
`onChange`, `min`, `max`, `step` (default 1), `decrementLabel`,
`incrementLabel`, `disabled`, `hint`, `error`, and `testID` (parts
`<testID>-decrement`, `-value`, `-increment`). A button fades and stops at
its bound; the value is one adjustable element with increment and decrement
actions. No new dependency.
