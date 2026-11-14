Scalewing request from FutMas.

Status: accepted 2026-11-14 (FutMas F-024 docs).
Renderer: react
Missing surface: `Box` `link="inline"`: a link inside running body text, in the accent and always underlined. A third look of `Box as="a"` `link`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the FutMas docs site (F-024) puts links inside paragraphs, and its rule is blue for clickable. With the canvas link (`[data-theme] a`, the accent with no underline), axe's `link-in-text-block` fails in the dark scheme: the accent is under 3:1 against the surrounding text and there is no non-colour cue. `link="quiet"` passes but keeps the text colour, so it is not blue. FutMas owns no CSS and cannot restyle `a`.
Existing surface this might already be: `Box as="a"` `link="accent"` (no underline) and `link="quiet"` (not the accent); `MarkdownView`'s links (underlined, but only for Markdown source, not for a React paragraph).
Workaround I almost used: quiet links in the docs' paragraphs, which breaks the blue-for-clickable rule.
FutMas use: links in the docs pages' body text (guides and concept pages).
Proposed API: `link?: 'accent' | 'quiet' | 'inline'` on `Box`, for `as="a"` only.

## Accepted API (2026-11-14)

- `Box` `link="inline"` adds the generated `sw-link-inline` under `[data-theme] a.sw-link-inline`, which outranks the canvas link rules, hover included: the accent colour, always underlined with a 1px line 0.18em below the baseline in the accent at 60 % (`color-mix` with `transparent`, as the inverse band's links). Hover and `:focus-visible` draw the line in the full accent at the focus ring's width, and the words stay in the accent. Focus keeps the canvas ring; forced colours paint the words and line in the system link colour; `external` keeps its arrow.
- The underline is the non-colour cue WCAG 1.4.1 asks for, so it passes axe's `link-in-text-block` wherever the accent is under 3:1 against the text. `boxLinkAppearances` gains `'inline'`; the validation is unchanged (`TypeError` off `as="a"`, `RangeError` for an unknown look).

Evidence: `box-link.test.tsx` (looks, class, generated rules and order); gallery "Link" section (a paragraph with an inline link and an external inline link); `apps/gallery/e2e/link-inline.spec.ts` (underlined at rest, the canvas link's accent, axe `link-in-text-block` passes the paragraph in light and dark, the canvas accent link flagged in dark as the negative control, the line at 2px in the full accent on hover and focus, the focus ring; desktop-en, mobile-es, forced-colors).
