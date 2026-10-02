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

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
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

## Follow-up request (2026-10-02, Teisoro F-007 task 1550): a wide table shows that it scrolls

Status: Merged in #89 (2026-10-02) and released in `@scalewing/react` 1.17.0; Teisoro pins it in F-007 task 1550. The `stackBelow` request above is still not started; Teisoro's review asks Teisoro to render the phone layout itself (VLT-1, HIS-3).
Source: Teisoro UX reviews `vault-page-and-access.md`, finding VLT-1 (major; the Scalewing part), and `vault-history.md`, finding HIS-3 (major; its "let the scroll region show a fade at its right edge"). Admin 02 at 390 px: the audit history shows "Fecha", "Saldo esperado" and "Tu conteo", the variance, status and Resolve are off the right edge, and nothing says the table scrolls; the history's 10- and 8-column tables the same. `Table`'s `ScrollRegion` scrolls sideways with no edge shadow, fade or scrollbar cue, and a phone's overlay scrollbar hides until touched.

Teisoro need: any `Table` (and `DenominationGrid` strip) wider than its card shows, at a glance, that more columns are past its edge.

Behavior (no API change): while a scroll region's content is scrolled out past an inline edge, `ScrollRegion` adds `sw-scroll-more-start` and/or `sw-scroll-more-end`, and that edge draws a shade: an inset box shadow in the text color at 28% (`color-mix`, as the dialog backdrop), 32 px offset and 24 px blur from spacing steps 6 and 5, painted under the content so nothing moves. At the start only the end is shaded; scrolled to the middle both are; at the end only the start. The edges follow the writing direction (`:dir(rtl)`), and the both-edges rule comes last so it wins the RTL rules it ties. A table that fits has no class and no shadow, so it renders exactly as before. The region measures on mount, on every scroll and when it or its content is resized (`ResizeObserver`, falling back to window resize); before mount and on the server it reports no overflow. The pure reading of the scroll metrics (`scroll-overflow.ts`, with a 1 px tolerance and RTL's negative `scrollLeft`) is tested without a browser. In a `DenominationGrid` strip the pinned, opaque row labels cover the region's own start shade, so while the strip is scrolled the labels cast it instead: a gradient a spacing step wide past their inline end (`pinnedStartShadeRules`, the labels' `::after`, mirrored right to left). Forced colors drop box shadows (and the strip's gradient is not drawn); there the system's classic scrollbar is the cue. `ScrollRegion` and its hook are `'use client'`, so `Table` still renders from a server component.

Default on, not opt-in: every wide table wants the cue, and a table that does not overflow is unchanged. It is a visual addition, so the release is minor.

Rejected alternatives:

- A pure-CSS scroll shadow (`background-attachment: local` cover gradients). It needs an opaque background the same color as the surface under the table, which is glass (translucent) in a `Card`.
- A `mask-image` fade. It fades the content itself, including the pinned row labels of a `DenominationGrid` strip and the focus ring drawn inside the region's edge.
- A scroll-driven animation (`animation-timeline: scroll()`). Not yet in every browser Teisoro supports.
- Always showing a scrollbar. Overlay scrollbars cannot be forced on in every browser, and a permanent bar is chrome the quiet visual language avoids.
- A `scrollCue` prop. There is no case where a table that scrolls should hide that it does.

Evidence: `scroll-region.test.tsx` (`scrollOverflow`: fits within a pixel, start, middle and end, RTL; Table: no cue when it fits, `sw-scroll-more-end` then both then `sw-scroll-more-start` as it scrolls, a resize measures again; the generated rules, RTL mirrored and the both-edges rule last); the existing wrapper test in `data.test.tsx` (a table that fits keeps exactly `sw-table-wrap`); `scroll-region.test.tsx` also checks the region and its table are both observed for resizes, and the strip's pinned shade rules; `apps/gallery/e2e/table.spec.ts` "a wide Table shades the edge with more columns past it, on a phone too" on desktop-en, mobile-es and forced-colors: the gallery's nine-column "Survey log" fits at 1280 px with no class and no shadow; in forced colors at 390 px it overflows with `sw-scroll-more-end` and no shadow; at 390 px it overflows with `sw-scroll-more-end` and a right-edge inset shadow, both classes at 40 px in, `sw-scroll-more-start` and a left-edge shadow at the end, and the region stays within the screen; "a wide right-to-left Table …" on mobile-es: with the region turned right to left, the end shade is on the left and, scrolled to the end, the start shade on the right; `apps/gallery/e2e/denomination-grid.spec.ts` "a scrolled DenominationGrid strip casts its start shade from the pinned labels": at 390 px in every project the eleven-column "Sightings by hour" strip, scrolled 60 px, draws the gradient past its pinned labels, and in forced colors the gradient is `display: none`.
