---
'@scalewing/react': minor
---

`Stepper` takes `unit` (opt-in), a short muted word after the count inside its frame, such as "min" or "players". The count is read with it (`aria-valuetext` "90 min") unless `valueText` says it in words; the unit itself is hidden from assistive technology. The frame draws the control surface, focus ring and the invalid, changed and disabled states; the count keeps its few-digit width, so the frame never follows it. A blank `unit` throws a `RangeError`. New classes `sw-stepper-count`, `sw-stepper-unit`. No new tokens or dependencies. Request: `docs/requests/futmas-stepper-unit.md`.
