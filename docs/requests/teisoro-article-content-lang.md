Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.45.0 (PR #221; accepted 2026-10-20; Teisoro F-014-S06 "Acceptance and UX check", task 2628; the gap its acceptance review found in Training's reader; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: an `Article` whose title and body are marked as another language than the page's.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro's training reader shows a page as an `Article`. On an English screen it shows a Spanish page when only Spanish exists or the reader switches to Español (and the other way round), and WCAG 3.1.2 (Language of Parts) asks for those words to carry their own `lang`. `Article` takes its `title` as a string and draws the heading itself, so Teisoro cannot wrap it; `lang` on the whole `Article` would also mark the eyebrow (the section's path), the meta line (who and when) and the actions (the language switch), which are the app's words in the screen's language.
Existing surface this might already be: `Article` (`title`, `children`, and the native `lang` on the whole article); `ListRow` `titleLang` and `ActionMenu` `detailLang` meet the same need in a row and a menu.
Workaround I almost used: `lang` on the whole article, which tells a screen reader to read the English path and date with Spanish sounds; or wrapping only the body, which leaves the title unmarked.
Teisoro use: `training/TrainingReaderPage`'s article, passing `'en'` or `'es'` when the page shown is not in the screen's language.
Proposed API: `contentLang?: string` on `Article`, opt-in; `lang` on the title heading and the body container only.

## Accepted API (2026-10-20)

- `contentLang?: string`: a BCP 47 tag, set as `lang` on the title's heading (`sw-article-title`, the element that names the article) and on the body's box (`sw-article-content`), which holds the consumer's `children`. Without children only the title is marked.
- Never on the eyebrow, the meta line, the actions or the cover (whose `alt` the consumer writes, in the page's language or marked inside its own words); they are the app's words.
- The article's name (its title) is unchanged; `lang` changes how the words are spoken, not which words are read.
- A consumer's `lang` on the whole `Article` still passes through to the `article` element, for an article whose every word is in that language.
- A blank `contentLang` throws a `RangeError` (as `ListRow`'s blank `titleLang` does); any other tag is passed through, as the native attribute is.
- An article without `contentLang` renders exactly as before. No new classes, tokens, layers or dependencies.

Evidence: `article-content-lang.test.tsx` (the heading and the body the only marked elements, the eyebrow, meta, actions and cover outside them, the body's words inside; the title alone without a body; no `lang` without the prop, a whole-article `lang` kept; a blank tag refused); gallery "Article" (a field guide only in Spanish on the English page, its eyebrow and meta in English); `apps/gallery/e2e/article-content-lang.spec.ts` on desktop-en, mobile-es and forced-colors (two marked parts, the heading and the body, `:lang(es)` matching inside the body; the eyebrow and meta matching `:lang(en)`; the parts in their order; an article without the prop unmarked), with `article.spec.ts` unchanged and passing.
