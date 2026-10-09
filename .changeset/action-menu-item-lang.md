---
'@scalewing/react': minor
---

`ActionMenuItem` `lang` (`docs/requests/teisoro-action-menu.md`, 2026-10-08 follow-up, Teisoro F-006-S11, SET-14). `lang?: string`, a BCP 47 tag, marks a command's label as another language than the page's, such as "English" on a Spanish page, so assistive technology reads it in its own language (WCAG 3.1.2). It is set on the label's own element, not the command, so the command keeps the page's language for anything else. Without it the markup is unchanged. No new classes, tokens or dependencies.
