Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.45.0 (PR #219; accepted 2026-10-20; Teisoro F-014-S06 "Acceptance and UX check", task 2628; the gap its UX review heard on Training's add and edit forms; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: none new; a fix to `Step`'s heading name.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: a folded step's heading ends in a visually hidden status word, and Chrome computes its name as "Qué vas a agregar , Listo", a space before the comma, because the hidden box (`sw-sr-only`, absolutely positioned) is laid out as a block and the name computation puts a space around a block. Screen readers read the heading list and focus announcements with the stray pause, and Teisoro's specs match the name with `\s*,`. The heading is `Step`'s own markup, so the consumer cannot change it.
Existing surface this might already be: `Step` (`title`, `Steps labels`).
Workaround I almost used: a regular expression in every consumer spec, which hides the problem from tests only.
Teisoro use: every `GuidedForm` step (Training's add and edit forms, Services, Check cashing).
Proposed API: none; the heading's name reads "Qué vas a agregar, Listo" and the drawn look is unchanged.

## Accepted change (2026-10-20)

- While a step has a status word (upcoming, done, error, and skipped without a reason), its heading holds the drawn title in its own box with `aria-hidden="true"` and one `sw-sr-only` line with the whole spoken name: the title, a comma, a space and the word. The name is that one line, so no browser puts a space before the comma.
- `aria-hidden` sits on the title's own box, never a wrapper: the step's region (`Steps open`) and its Edit button are named by that box's id, and Chrome reads a referenced box inside an `aria-hidden` wrapper into the heading's name as well ("The site The site, Done"); on the box itself it does not.
- A current step, and a skipped step showing its reason, have no status word and keep their markup.
- Nothing drawn changes: the screenshots `steps.spec.ts` and `steps-open.spec.ts` write (`steps.png`, `steps-open.png`) on desktop-en, mobile-es and forced-colors, taken on `main` (#218) and on this branch, are pixel-identical, all six (compared with Pillow's `ImageChops.difference`, no differing box).
- Trade-offs accepted: the heading's text content holds the title twice, so a consumer test reading a folded heading's `textContent` or matching its title with a pattern finds both (Teisoro's specs query headings by role and name); copying a folded heading or finding its title in the page meets the words twice. Avoiding that would need a new class (`user-select`), which this fix does not add. The ", " after the title is Scalewing's, as it was.
- Checked in Chromium (its own accessibility tree through the DevTools protocol); the gallery's browser projects are Chromium, and WebKit runs only the Tab order spec. The name is now one text box, so there are no two boxes to space apart. The Edit button and an open list's region read the `aria-hidden` title box by direct reference, which the accessible name computation allows and Chromium does; Teisoro's Safari and Firefox checks are its own.
- No new classes, tokens, layers or dependencies. A patch.

Evidence: `steps-status-words.test.tsx` (a done and an upcoming step's heading exposing one part with the whole name, the drawn title hidden, Edit still named by the title; an open list's region named by the title alone; a current step and a skipped step's reason unchanged); `steps.test.tsx` and `steps-open.test.tsx` now compare heading names, not text content; `apps/gallery/e2e/steps-status-words.spec.ts` on desktop-en, mobile-es and forced-colors (Chrome's own computed name from its accessibility tree and Playwright's, for the headings, the Edit button and the open list's region: both "Done, Done" and "Upcoming, Not started" with no space before the comma; the hidden line a 1 px box; the drawn title visible; a step turned done and its Edit; an open list's region, and a step greyed out by a block reading "The count, Not started"), with `steps.spec.ts` and `steps-open.spec.ts` matching the exact names in place of `\s*,`.
