Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); not started.
Renderer: react
Missing surface: a tinted section header (a heading on a toned band).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Angular's Get Change dialog heads its two halves with a green band ("Getting from the vault") and an orange band ("Giving back to the vault"). Scalewing has toned `Text` but no toned surface, and Teisoro owns no CSS, so React shows a coloured heading with an arrow icon.
Existing surface this might already be: `Text color`; the proposed `Card tone` in teisoro-card-tone.md (an edge, not a band).
Workaround I almost used: a `Box` with an inline background.
Teisoro use: `apps/teisoro-web/src/app/closeout-day/GetChangeDialog.tsx`. Design: Teisoro `docs/design/vault/get-change.md` gap 2.
Proposed API: `SectionHeader tone="success" | "warning" | …`, `icon?`, `level` (the heading level), children; a subtle tinted background with the tone's text colour at 4.5:1 or better.
Behavior and failure boundary: decoration and heading semantics only.
