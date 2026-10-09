---
'@scalewing/react': minor
---

`Field` `changed` (`docs/requests/teisoro-field-validation.md`, 2026-10-08 follow-up, Teisoro F-006-S11, COR-5). `changed?: boolean` marks a value the person changed from a saved one, such as a field in a correction: the control's border, or an adorned field's frame, in the accent color and a hairline thicker through an inset shadow, so nothing moves (`Highlight` in forced colors). It is a cue beside the words: say what the value was in `description`. `invalid` and `error` win over it. It sets no ARIA state. Like `invalid`, passing it, even `false` but not `undefined`, requires one native control child from the first render (a `TypeError` otherwise). New generated class `sw-field-changed`. No new tokens and no new dependencies.
