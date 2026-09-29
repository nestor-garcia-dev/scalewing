Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); not started.
Renderer: react
Missing surface: a `Table` that becomes a stacked list of label/value cards below a breakpoint.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro's vault audit history is a six-column table (date and time, expected, counted, variance, status, auditor) with a details toggle and a resolve button per row. At 390 px it can only scroll sideways inside its card; every other part of the page stacks. Building the phone version by hand means rendering the data twice with `Visibility` and keeping the two in step, with row actions and the selected-row tone duplicated.
Existing surface this might already be: `Table` (fixed columns); `Visibility` from teisoro-responsive-visibility.md (lets a consumer render two layouts, which is the duplication this avoids).
Workaround I almost used: a product list component for the phone layout.
Teisoro use: the audit history on `/vault` (`apps/teisoro-web/src/app/vault-page/AuditCard.tsx`); later the change-orders debt history, which review round 3 cut to two columns to fit (Teisoro `docs/design/vault/change-orders.md`). Design: Teisoro `docs/design/vault/README.md`, Scalewing gap 2.
Proposed API: `Table` `stackBelow?: 'sm' | 'md'`: below that width each row renders as a card whose cells are labelled by their column headers (the header text is reused, so the consumer writes it once), a row's actions sit at the card's end, and `TableRow selected` keeps its tone.
Behavior and failure boundary: presentation only; the semantic table stays for assistive technology, or the stacked form is a list with the same content in the same order. No sorting or paging.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1350): a selected row that moves no column

Status: implemented on `claude/services-rereview-fixes` for Teisoro F-007-S05 task 1350; pull request pending review.
Source: Teisoro UX re-review `services-nsf.md`, finding NSF-12 (partly fixed after 1.12.0, the Scalewing part). On the NSF record form the columns still moved when a check was picked, by 11 px (the Customer header from x 283 to 294, Company 454 to 464, Check # 747 to 753), and the row was not tinted (its pixels white). `TableRow selected` drew an 8 px accent dot at the row's start and added `padding-inline-start: var(--sw-space-5)` to the first cell; that padding was the shift. The review's remaining fix: reserve the marker's space or draw it outside the cell's padding, and add the tint Teisoro's `NsfRecordPage.tsx:645–647` expected.

Teisoro use: the NSF record form's check picker (`apps/teisoro-web/src/app/NsfRecordPage.tsx`), a comfortable table whose rows are chosen with a pressed "Select" button.

Behavior (no API change):

- The marker is a 4 px (`--sw-space-1`) accent bar the full height of the row at its inline start: the first cell's `::before`, absolutely placed at the cell's inline start inside its padding (12 px comfortable, 8 px compact), so it takes no layout space. The first cell keeps its padding, so no column and no text moves when a row is picked, at either density. The bar is 3:1 or more against the page and the surface in every palette and scheme. It follows the writing direction (`border-inline-start`, `inset-inline-start`): in a right-to-left table it hugs the cell's right edge, clear of a checkbox at the cell's start.
- The row takes no fill. Text, muted text and accent text (ghost buttons, links) keep the contrast they have on whatever holds the table.
- The bar is a border, not a fill, so forced colors keep it; it is drawn in `Highlight`.
- The table rules moved from `css/css-data.ts` to their own `css/css-table.ts`.

NSF-12 asked for a tint as well as a shift-free marker. The first version of this change tinted the row with `--sw-color-subtle`. The code review of PR #75 found that tint dropped accent text (ghost buttons, links in a row) under 4.5:1: cornflower 4.03, soft-blue 4.26, capri 4.36, raspberry 4.11, amber 4.49, fuchsia 4.21 and synthwave 4.43 in light, and synthwave 3.85 in dark. The tint is dropped; the bar alone marks the row, and Teisoro's `NsfRecordPage.tsx:645–647` comment, which expects a tint, should be updated when it pins this release.

Rejected alternatives:

- Any tint. The accent tint (`--sw-color-accentSubtle`) the review suggested drops muted text to 4.14:1 (`ink` light), and the neutral `subtle` tint drops accent text under 4.5:1 in eight palette schemes (above). No single fill keeps text, muted and accent at 4.5:1 in every palette, and the bar is enough to mark the row.
- Reserving the marker's space on every row of a table that has a selectable row. The table would need to know that a row can be selected before one is, and a consumer's widths would still change when that becomes true.
- An inset `box-shadow` for the bar. It takes no space either, but forced colors drop shadows, so the selection would vanish there, and a physical x offset does not follow right-to-left.
- A fixed-width Select column in Teisoro. It hides the shift for one table but leaves the component moving columns everywhere else.

Evidence: `table-selected-row.test.ts`:

- Nothing in the selected rules sets padding, margin, width or background, and the bar is `position: absolute`. The compact override is gone. Forced colors draw the bar in `Highlight`.
- Every palette × light and dark, using the shared `forEveryTheme` loop:
  - text, muted and accent on the row's ground (page or surface) are at 4.5:1 or more. The one exception is harvest dark's accent on its surface (4.24:1), a palette property the tokens tests record and the selection neither causes nor worsens.
  - the bar is at 3:1 or more against the page and the surface.

`data.test.tsx`: `aria-selected` and the class, unchanged.

`apps/gallery/e2e/table.spec.ts`, on desktop-en, mobile-es and forced-colors (emulated), using the shared `colorContrast` and `systemColor` helpers:

- "a selected Table row is marked by a bar without moving a column or filling the row", with the gallery's "Tracking collars" table:
  - pressing "Select c-221" moves no column header and no first-cell text (measured against the table, under 0.5 px), and the row's first-cell text lines up with an unselected row's;
  - the cell's fill does not change;
  - the bar is an absolute 4 px solid `::before` at 3:1 or more against the painted ground (the system highlight in forced colors);
  - in the compact "Watch list" the selected row's text starts where the others' does.
- "in a right-to-left table the bar sits at the right edge, clear of a checkbox", with the new compact Arabic "أطواق التتبع" table whose first cell is a `Checkbox`:
  - the bar's `right` is 0 and it is drawn with the right border;
  - the checkbox mark ends at least the bar's 4 px inside the cell's right edge;
  - checking a row does not move its checkbox.
