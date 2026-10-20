Scalewing request from Teisoro.

Status: accepted 2026-10-20 (Teisoro F-014-S06 "Acceptance and UX check", task 2628; the gap its acceptance review found on Training's lists; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a web `ListRow` whose title is marked as another language than the page's.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro's training library lists documents written in English, Spanish or both. On a Spanish screen a document only in English keeps its English title (and the other way round), and WCAG 3.1.2 (Language of Parts) asks for that title to carry its own `lang`, so a screen reader speaks it in English rather than reading English words with Spanish sounds. `ListRow` takes its `title` as a string and draws it itself, so Teisoro cannot wrap the words in a `<span lang>`; putting `lang` on the whole row would also mark the detail, the tag ("Solo en inglés") and the unread words ("Nuevo"), which are in the page's language.
Existing surface this might already be: `ListRow` (`title`); `ActionMenu` already has `detailLang` and an item `lang` for the same need in a menu. `Table` cells take any React node and the native `lang` attribute, so a table's title cell needs nothing new.
Workaround I almost used: an `aria-label` on the row naming the title in the right language, which changes nothing about how the words are spoken and drops the row's own naming.
Teisoro use: `training/TrainingRow` in the Library's section cards, New for you, the section pages and the phone lists, and the Archived page's phone list, passing `'en'` or `'es'` for a document title shown on a screen in the other language.
Proposed API: `titleLang?: string` on `ListRow`, opt-in; `lang` on the title's words only.

## Accepted API (2026-10-20)

- `titleLang?: string`: a BCP 47 tag, set as `lang` on the row's title box (`sw-list-row-title`, the element named by the row's `aria-labelledby`), which holds the title's words and, on an unread row, the wordless dot (`aria-hidden`). With `truncate` the words box sits inside it, so it is marked too.
- Never on the detail, the value, its detail, the tag, the unread words (`sw-sr-only`, read after the title) or the action; they stay in the page's language. A tag in another language takes its own `lang` inside the consumer's node.
- A pressable row's name (title, unread words, value) and description (detail, value detail, tag) are unchanged; `lang` changes how the words are spoken, not which words are read.
- A blank `titleLang` throws a `RangeError` (as `ActionMenu`'s blank `detailLang` does); any other tag is passed through for the browser to read, as the native attribute is.
- A row without `titleLang` renders exactly as before.
- No new classes, tokens, layers or dependencies.

Evidence: `list-row-title-lang.test.tsx` (a link row's title box the only element with `lang`, its name and description unchanged, the detail, value, value detail, tag and unread words outside it; a button row, a truncated row and a statement row marked the same way; no `lang` without the prop; a blank tag refused); gallery "ListGroup" (the Field guides card's Spanish guide "Coro de ranas" on the English page, `titleLang="es"`); `apps/gallery/e2e/list-row-title-lang.spec.ts` on desktop-en, mobile-es and forced-colors (the row's name and description, the title box the one `lang="es"` element and `:lang(es)` matching it only, a row without the prop unmarked, the title still above its detail), with `list-group.spec.ts`, `list-row-trailing.spec.ts` and `list-row-truncate.spec.ts` unchanged and passing.
