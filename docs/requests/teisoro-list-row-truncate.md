Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.44.0 (tagged as 1.43.0 first, which was never published; PR #206; accepted 2026-10-19; Teisoro F-014-S07 "Scalewing fidelity", task 2630; the gap Teisoro F-014-S04 task 2615 found on the training boards Main, TrainingCashierEs, PhoneTraining and PhoneSection; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a web `ListRow` whose title and detail stay on one line each, cut with "…".
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the training boards' document rows end a long title and a long grey line in "…" on one line, so a section card of four rows stays four lines tall and the New dot stays beside the title. `ListRow` wraps both (`overflow-wrap: anywhere`), so a long Spanish title takes two or three lines on a phone. Teisoro owns no CSS, so it cannot cut the words itself, and composing the row by hand would copy ListRow's layout, naming and hover rules.
Existing surface this might already be: `ListRow` (`title`, `detail`); `Text` has no one-line truncation either, and a row's title is not a `Text`.
Workaround I almost used: shorter titles, which the store writes, not Teisoro.
Teisoro use: `training/TrainingRow` in the Library's section cards, New for you, the section pages and the phone lists.
Proposed API: `truncate?: boolean` on `ListRow`, opt-in; the full words stay in the accessible name and a `title` tooltip.

## Accepted API (2026-10-19)

- `truncate?: boolean` (default `false`): the row takes `sw-list-row-truncate`. Its title's words sit in their own box (`sw-list-row-title-text`, its rule scoped under `sw-list-row-truncate` in 1.44.0) and it and the detail line each stay on one line, cut with an ellipsis where they do not fit (`white-space: nowrap`, `text-overflow: ellipsis`). The title is a one-line flex row, so the unread dot follows the cut words and is never hidden by the cut.
- The whole words stay in the DOM, so a pressable row's name (title, unread words, value) and description (detail, value detail, tag) are unchanged; the words box and the detail carry a `title` tooltip with the whole words for a pointer.
- The value, its detail, the tag and the action keep their words whole and their place; only the label column gives way.
- A tooltip needs a pointer: on a touch screen or from the keyboard the cut words are whole only in what the row opens and in what assistive technology reads. Teisoro's rows open the whole document.
- A row without `truncate` renders exactly as before (no words box, no tooltip).
- No new tokens, layers or dependencies. New classes `sw-list-row-truncate` and `sw-list-row-title-text`, in `css/css-list-row-truncate.ts`.

Evidence: `list-row-truncate.test.tsx` (a link row's name and description with the whole words, the tooltips, the dot after the words box, a button row and a statement row, a row without `truncate` unchanged, the generated rules and the catalog); gallery "ListGroup" (two shelves side by side: link rows cut beside the dot, the language tags and each row's menu; a button row; a statement row whose value and its line stay whole; light and dark); `apps/gallery/e2e/list-row-truncate.spec.ts` on desktop-en, mobile-es and forced-colors (the name and description, one line each with an ellipsis and words wider than their box, the tooltip, the dot a space-2 across, visible after the cut words inside the label, a fitting row not cut, the tag whole, the menu whole outside the link, a cut button row, a statement row's value and its line whole, no sideways scroll), with `list-group.spec.ts` and `list-row-trailing.spec.ts` unchanged and passing.
