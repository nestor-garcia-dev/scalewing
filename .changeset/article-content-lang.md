---
'@scalewing/react': minor
---

`Article` `contentLang`: the language of the title and the body (a BCP 47 tag such as `es`) when it is not the page's, set as `lang` on the title's heading and the body's box only, never the eyebrow, meta line, actions or cover, which are the app's words (WCAG 3.1.2). The article's name is unchanged. A blank `contentLang` throws a `RangeError`. No new classes, tokens or dependencies. Request: `docs/requests/teisoro-article-content-lang.md`.
