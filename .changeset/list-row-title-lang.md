---
'@scalewing/react': minor
---

`ListRow` `titleLang`: the title's language (a BCP 47 tag such as `es`) when it is not the page's, set as `lang` on the title's box only (its words and the wordless unread dot), never the detail, value, tag or unread words (WCAG 3.1.2). A pressable row's name and description are unchanged; it works with `truncate`. A blank `titleLang` throws a `RangeError`. No new classes, tokens or dependencies. Request: `docs/requests/teisoro-list-row-title-lang.md`.
