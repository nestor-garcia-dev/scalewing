Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); not started.
Renderer: react
Missing surface: a tone edge on `Card`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the frozen Angular vault pages tell cards apart by a coloured left border (balance purple, audit green, tasks orange, movements grey; a movement card green when cash came in and orange when it went out; on change orders the inventory blue, the debt orange, a pending order orange and a completed one green). `Card` takes only `padding` and `variant`, and Teisoro owns no CSS, so the state now lives only in badges and text colour.
Existing surface this might already be: `Card variant`; `Badge tone`.
Workaround I almost used: a `Box` with an inline border style.
Teisoro use: `apps/teisoro-web/src/app/vault-page/MovementsCard.tsx` (movement in or out), `OrderCard` in `apps/teisoro-web/src/app/change-orders/parts.tsx` (pending, completed, cancelled), `BankDebtCard.tsx`. Design: Teisoro `docs/design/vault/README.md` gap 3 and `docs/design/vault/change-orders.md` gap 3.
Proposed API: `Card tone?: 'accent' | 'success' | 'warning' | 'danger' | 'neutral'`, drawn as a 4 px inline-start edge in that semantic colour; no tone draws none.
Behavior and failure boundary: decoration only; the tone never carries meaning alone (the consumer keeps a badge or text for the state), and the edge follows the writing direction.
