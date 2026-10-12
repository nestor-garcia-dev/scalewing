Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.33.0 (PR #153; accepted 2026-10-12; Teisoro F-011 task 2145; plan approval under Teisoro decisions O-1 to O-4 and D-1).
Renderer: react
Missing surface: `Box` `link="quiet"`: a quiet link look for a title that opens something, such as a table row's title. An extension of `Box as="a"`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro's cash ledger (F-011 S18, `CashLedger`) makes each row's title a link to the entry. The boards draw those titles in the text colour, bold, not in the accent. With the canvas link (`[data-theme] a`, accent colour, no underline) inside the row's body text, axe's `link-in-text-block` fails (accent to text contrast under 3:1 in the sky palette and no non-colour cue), so Teisoro's ledger journeys could only audit an open sheet, not the page (Teisoro D-85). Teisoro owns no CSS and cannot restyle `a`.
Existing surface this might already be: `Box as="a"` (accent only); `Button variant="ghost"` (a press control, not a link, and accent); `SectionNav` / `Nav` (navigation clusters).
Workaround I almost used: leaving the titles as accent links and auditing only the open sheet (shipped in S21), or plain text with a separate Open action.
Teisoro use: `CashLedger` row titles (Services day ledger, Change today).
Proposed API: `link?: 'accent' | 'quiet'` on `Box`, for `as="a"` only.

## Accepted API (2026-10-12)

- `Box` `link` (`BoxLink`, `boxLinkAppearances`): `'accent'` (default, no class: the canvas link) or `'quiet'`, the generated `sw-link-quiet`: `color: inherit` and font weight 600 (the `label` typography weight) under `[data-theme] a.sw-link-quiet`, which outranks the canvas link rules; hover and `:focus-visible` underline it, focus keeps the canvas ring. Forced colours paint it as any link.
- Weight is the non-colour cue (WCAG 1.4.1), so it is for text lighter than 600. axe's `link-in-text-block` passes it on colour (the same colour and background as its text) or on its weight difference; the weight is what keeps it visibly a link. In text already at 600 the quiet look has no cue, and an accent link there needs at least 3:1 against the text. `link` on a box that is not `as="a"` throws a `TypeError`; an unknown value throws a `RangeError`.

Evidence: `box-link.test.tsx` (class, validation, generated rules and order); gallery "Link" section ("Morning sightings" table with quiet row titles); `apps/gallery/e2e/link-quiet.spec.ts` (weight 600 against its body-weight cell, the text colour, no underline at rest; axe `link-in-text-block` passes the quiet title and flags an accent link at weight 400 in the same cell, the negative control; underline on hover and focus, the focus ring; desktop-en, mobile-es, forced-colors).
