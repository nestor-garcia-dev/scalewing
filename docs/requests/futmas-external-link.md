Scalewing request from FutMas.

Status: accepted for `@scalewing/react` 1.54.0 (2026-10-25; FutMas F-010-S14 "Venues" gap 1: "Check it on Google Maps" opens a new tab; standing owner approval).
Renderer: react
Missing surface: a link that opens in a new tab with a cue for sighted and screen-reader users. An extension of `Box as="a"`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Box as="a"` takes `href`, `target` and `rel`, but has no new-tab cue, and FutMas cannot draw a glyph or hidden words without its own CSS (no `style=`, no stylesheet).
Existing surface this might already be: `MarkdownView` links (new tab, hidden `newTabLabel`), but only inside Markdown; `ButtonLink` is a link drawn as a Button, too heavy for a line of text.
Workaround I almost used: `ui/ExternalLink.tsx`, `Box as="a"` with `target`/`rel`, a Lucide glyph and an `aria-label` repeating the words.

## Accepted API (2026-10-25)

`Box` gains `external?: boolean` and `newTabLabel?: string`.

- `external` (only with `as="a"`, else a `TypeError`) sets `target="_blank"` and adds `noopener noreferrer` to the consumer's `rel` words (each once; `target` is always `_blank`).
- It draws a decorative arrow (↗, `sw-link-external-mark`, `aria-hidden`) right after the words, with no space so it never wraps alone: borders in `currentColor` (the link's colour, kept in forced colours), a space-2 square a space-1 after the words, mirrored in right-to-left text.
- `newTabLabel` is the hidden words read after the name (`sw-sr-only`), such as "(opens in a new tab)". Scalewing ships no product copy (as `MarkdownView newTabLabel` and `DateField labels`), so it is required with `external` (blank: `RangeError`) and refused without it (`TypeError`). The plan's `externalLabel` is named `newTabLabel` to match `MarkdownView`.
- Works with `link="quiet"`.

Evidence: `box-external-link.test.tsx` (attributes, name, rel merge, mark and hidden words, refusals, generated CSS); `apps/gallery/e2e/link-external.spec.ts` (name, arrow in the link colour on its line, a press opens a new page with no opener in every project); gallery Link section.
