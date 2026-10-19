---
'@scalewing/react': minor
---

`Article`: a page that reads like a post, on a card (`variant`, as `Card`'s) no wider than the new `--sw-reading-max` (46rem): an optional `cover` photo (`{ src, alt }` or `null`) edge to edge across the top, the `eyebrow` with the consumer's `actions` at its row's end, the `title` in heading type (`titleAs` `h1`, `h2` or `h3`; it names the `article` landmark, which the ref reaches), the muted `meta` line, a hairline and the body. New exports `Article`, `ArticleProps`, `ArticleCover`, `ArticleTitleElement`, `articleTitleElements`; new `sw-article*` classes. No new tokens, no new dependency. Request: `docs/requests/teisoro-article.md`.
