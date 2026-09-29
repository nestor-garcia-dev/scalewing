---
'@scalewing/react': minor
---

`RadioGroup` options take an `icon` (`docs/requests/teisoro-radio-group.md`, 2026-09-28 follow-up, Teisoro CHK-13). `RadioGroupOption.icon?: ReactNode` renders a decorative glyph between the radio and its label, `aria-hidden`, in the text color (new generated class `sw-radio-group-icon`). The option's accessible name stays its `label` text, and a press on the glyph chooses the option. Without `icon` nothing changes. No new dependencies.
