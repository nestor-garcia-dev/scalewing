---
'@scalewing/react': minor
---

`Steps` and `Step` (with `StepsProps`, `StepProps`, `StepStatus`, `StepHeadingLevel` and `StepsLabels`): a one-page vertical stepper (`docs/requests/teisoro-steps.md`, Teisoro F-011 release R1).

- `Steps`: an `ol` of steps numbered by their place, with `headingLevel` (2 by default) and `labels` (the status words assistive technology hears; English by default).
- `Step`: `status` (`'upcoming' | 'current' | 'done' | 'error' | 'skipped'`), `title`, `summary`, `onEdit` and `editLabel`, `skippedReason`, `headingLevel`, `children`. The current and error steps are open with their fields; a done step folds to a check, its title, a truncated summary and a ghost Edit named by its title; steps ahead and skipped ones are greyed. A line joins each marker to the next.
- The current step has `aria-current="step"`; focus moves to a step's heading when it becomes current from a folded state (the first such step in an update).
- New generated classes `sw-steps`, `sw-steps-item`, `sw-steps-item-<status>`, `sw-steps-header`, `sw-steps-marker`, `sw-steps-title`, `sw-steps-reason`, `sw-steps-summary`, `sw-steps-edit` and `sw-steps-body`, from tokens (the `xs` control height marker, the `title` and body type). No new tokens or dependencies.
