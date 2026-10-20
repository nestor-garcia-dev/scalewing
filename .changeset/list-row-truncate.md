---
'@scalewing/react': minor
---

`ListRow` `truncate`: opt-in, keeps the title and the detail line to one line each, cut with "…" where they do not fit; the unread dot follows the cut words, the whole words stay in the row's name, description and a `title` tooltip, and the value, tag and action keep their words whole. New classes `sw-list-row-truncate` and `sw-list-row-title-text`. Rows without it are unchanged. No new tokens, no new dependency. Request: `docs/requests/teisoro-list-row-truncate.md`.
