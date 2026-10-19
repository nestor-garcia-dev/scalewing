Scalewing request from Teisoro.

Status: accepted 2026-10-19 (Teisoro F-014-S03 "Scalewing: file picker, PDF viewer, Markdown view, blue count", task 2610; the training library inventory's row 15 and §2; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: `Article`, a page that reads like a post.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the Procedure board and the phone reader draw a training page as a post: a cover photo edge to edge across the top of the card, then, inset, the eyebrow ("Store procedure · Services › Check cashing") with the English · Español switch at its row's end, the title at the app's heading size, the byline ("Manager 1 · Oct 16 · 4 min read"), a hairline and the body, at a reading width. `Card` pads everything, so the photo cannot reach its edges, and Teisoro writes no CSS to round the photo's corners, fix its ratio or cap the reading width.
Existing surface this might already be: `Card` with `padding={0}` and a padded `Box` inside (the photo's corners, ratio and the reading width still need CSS); `Stack` of `Text`s (no cover, no landmark).
Workaround I almost used: a Teisoro composite with an `img` and inline styles, which Teisoro does not write.
Teisoro use: the page reader on desktop and the phone (S05), around a `MarkdownView`.
Proposed API (inventory): cover image with alt text, eyebrow, title, meta, children.

## Accepted API (2026-10-19)

- `Article` (`ArticleProps`, `ArticleCover`, `ArticleTitleElement`, `articleTitleElements`):
  - `title: string`, drawn in heading type (`Text variant="heading"`), naming the `article` landmark;
  - `titleAs?: 'h1' | 'h2' | 'h3'`, `h1` by default (the article's own page);
  - `eyebrow?: ReactNode`, a muted line over the title, caption type at the label's weight;
  - `actions?: ReactNode`, controls at the end of the eyebrow's row (a language switch), wrapping under it on a narrow column;
  - `meta?: ReactNode`, a muted caption line under the title;
  - `cover?: { src: string; alt: string } | null`, the photo across the top (`alt` required; `''` when it only decorates; `null` is none);
  - `variant?: CardVariant`, the card look, as `Card`'s (`glass` by default);
  - `children`, the body under a hairline;
  - other `article` attributes (`id`, `lang`, `className`, an `aria-labelledby` that replaces the title's) pass through, and the ref is the `article` element.
- The eyebrow and meta are `div`s, so they may hold any content (a `Text`, an `Inline` with a badge).
- Layout: the card is no wider than `--sw-reading-max` (46rem, a new CSS variable beside `--sw-dialog-max`: about 70 characters of body type inside the padding). The cover is edge to edge at 3:1 (2:1 below `md`), `object-fit: cover`, with the card's top corners (`inherit`, never `overflow: hidden`, so a popup in the actions is not clipped), on the subtle fill while it loads. The words sit a space-6 from the top and bottom and a space-8 from the sides (space-5 all round below `md`): the eyebrow's row (the actions at its end; when the row is too narrow they wrap under the eyebrow, at its start), the title a space-3 under it, the meta a space-3 under the title, a hairline (`Separator decorative`) a space-3 under, the body a space-4 under that. The card sits at the start of a wider column, as a page's main column does.
- Empty parts (`undefined`, `null`, `false`, `''`) draw nothing.
- A blank `title`, an unknown `titleAs` or `variant`, or a `cover` with a blank `src` or without `alt` text throws a `RangeError`.
- New classes `sw-article`, `-cover`, `-body`, `-header`, `-top`, `-eyebrow`, `-actions`, `-title`, `-meta`, `-content`; new CSS variable `--sw-reading-max`. No new tokens, layers or dependencies.

### Differences from the boards (Teisoro D-2)

Sizes follow Scalewing's scale (F-014 D-29):

- The title is the heading step (28 points, 24 below `md`); the board writes 26.
- The card is 46rem (736 px) at most; the board's is 744 px.
- The card's radius is Card's large radius (24 px); the board's is 18 px.
- The words are a space-6 (32 px) under the cover and above the card's end; the board's are 28 px and 40 px.
- Eyebrow to title, title to meta and meta to hairline are a space-3 (12 px); the board's are about 14 px.
- The meta line is caption type (13 points); the board writes 14.

Evidence: `article.test.tsx` (the article named by its h1 title in heading type; the order cover, eyebrow with actions, title, meta, hairline, body; only the parts given drawn; an h2 title, a decorative cover, a variant, a class and an id; block content in the eyebrow and meta as `div`s, an h3 title, `lang`, the ref, a `null` cover and boolean actions drawing nothing; the refusals, an undefined title included; the generated reading width, cover ratio and corners, padding and catalog, from tokens); gallery "Article" (a field guide with a cover, a language switch that changes its words and `lang`, and a bulletin without cover or meta on the default glass card; light and dark, 390 px); `apps/gallery/e2e/article.spec.ts` on desktop-en, mobile-es and forced-colors (the landmark and heading, the cover loaded edge to edge at 3:1 or 2:1 with the card's corners, the reading width, the switch at the row's end on a wide screen and wrapped under the eyebrow at its start on a phone, changing the words, the muted eyebrow, no sideways scroll at 390, axe with contrast light and dark).
