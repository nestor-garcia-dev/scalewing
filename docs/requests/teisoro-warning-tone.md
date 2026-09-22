Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 820; pending independent review and packed-consumer verification.
Renderer: tokens and react
Missing surface: a `warning` semantic colour, and `Badge tone="warning"` / `Text color="warning"` on it.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro's rebuilt routes carry three status levels that the frozen Angular pages show in green, orange and red: an employee count that is inactive, a draft closeout beside a finalized one, an unconfirmed audit beside a balanced one, a customer "at risk" between GOOD and BLOCKED, an NSF record that is PENDING. Scalewing has `success` and `danger`; the middle level has no tone. Mapping it to `accent` reads as informational (and the accent is now sky blue), mapping it to `neutral` loses the signal, and `danger` says the wrong thing.
Existing surface this might already be: `Badge tone="accent"` (a highlight, not a caution); `Badge tone="neutral"`.
Workaround I almost used: none is allowed; Teisoro owns no colour.
Teisoro use: `docs/design/remaining-routes/` sections 2, 4, 5 and 6 (employee counts, Draft / Unconfirmed / Pending chips, "At risk" headings and their count pills, WARNING risk chips).
Proposed API: `warning` joins `semanticColorKeys` in `@scalewing/tokens` (light `#B54708`, dark `#FDB022`, both at or above 4.5:1 on the canvas and distinct from `danger` and `success`), so `--sw-color-warning` is generated and `Text color="warning"` works as the other keys do; `badgeTones` gains `warning` with the same outlined treatment as `success` and `danger` (generated `sw-badge-warning`). Palettes do not overlay it.
Behavior and failure boundary: colour only. No new component; consumers decide which state is a warning.

Scalewing owns the token, the class, tests, gallery evidence and changesets. Teisoro owns the copy inside the badge.
