---
'@scalewing/react': minor
---

`Step` `titleDetail`: muted words after an open step's title, on its line, such as "Optional" or "Wetlands done · Woodlands empty", at the label size and body weight in the muted colour, a space-2 after the title on its baseline or on their own line under it where they do not fit. Drawn while the step is open (current, error, or any step of `Steps open`), outside the heading, so the heading and the region keep the title's name; an open list's region is described by the words. A blank `titleDetail` throws a `RangeError`. New classes `sw-steps-title-line` and `sw-steps-title-detail`; the step's prop checks move to `steps/assert-step.ts` and its title line to `steps/StepTitleLine.tsx`. No new tokens, no new dependency. Request: `docs/requests/teisoro-step-title-detail.md`.
