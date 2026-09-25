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
