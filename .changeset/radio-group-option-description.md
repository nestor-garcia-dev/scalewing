---
'@scalewing/react': minor
---

`RadioGroup` options take a `description` (`docs/requests/teisoro-radio-group.md`, 2026-09-29 follow-up, Teisoro F-007-S05 task 1365). `RadioGroupOption.description?: ReactNode` is secondary text for that option: a muted caption at the row's inline end while it fits beside the label, and a second line under the label text when it does not or below `md` (new generated classes `sw-radio-group-body` and `sw-radio-group-option-description`). It is the radio's accessible description (`aria-describedby`), the radio's name stays its `label` text (`aria-labelledby` on the label text), and a press on it chooses the option. It may hold phrasing content such as a `Badge`, nothing interactive. An option with a description fills the group's width. Without `description` nothing changes. No new dependencies.
