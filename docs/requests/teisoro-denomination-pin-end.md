Scalewing request from Teisoro.

Status: accepted 2026-11-14 (Teisoro F-001 task 2910, FU-4; the product owner agreed on 2026-11-14 to fix it "with the long-tables rule": a table with a total scrolls inside itself with its header and total pinned).
Renderer: react
Missing surface: `DenominationGrid pinEnd`, the transposed grid's last column (its values and total) pinned at the inline end while the columns between scroll.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro owns no CSS. Store settings' "Change for the registers" is a transposed `DenominationGrid` on a phone; its coin boxes' names are long ("cajas de 25¢"), so at 390 px the value column and the total are cut off at the region's end (UX-5). The transposed grid pins the denomination column only.
Existing surface this might already be: `DenominationGrid transposeBelow` (pins the start only), `ScrollRegion` (no pinned cells), `Table` sticky header and footer (rows, not a column).
Workaround I almost used: shorter labels on a phone, which would drop "boxes" from the names.
Teisoro use: the change kept on hand in Admin › Store settings (bills and coin boxes).

## Accepted API (2026-11-14)

- `DenominationGrid` gains `pinEnd?: boolean`, default `false` (unchanged). While transposed, the last column (the last grid row's value line with its total, else its counts and total) is sticky at the inline end on the glass fill (a value cell keeps its subtle fill), casting the end shade before it while there is more to scroll; the denomination column stays pinned at the start. Classes `sw-denomination-scroll-pin-end`, `sw-denomination-transposed-end`.
- `pinEnd` without `transposeBelow` throws a `TypeError`; it changes nothing while the strip is not transposed. No new tokens or dependencies.

No board figures are quoted here.

Evidence: `denomination-pin-end.test.tsx` (the pinned cells for a value line and for a row without one, nothing by default or while not transposed, the refusal, the generated sticky rule and shade); the existing denomination tests unchanged; gallery "DenominationGrid" (nests in the reed bed, pinned); `apps/gallery/e2e/denomination-pin-end.spec.ts` on mobile-es (the region scrolls, the total's end and the label's start stay on the region's edges before and after scrolling, no sideways page scroll).
