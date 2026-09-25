Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); not started.
Renderer: react
Missing surface: an inline notice (banner) with semantic tones, `info`, `success`, `warning` and `danger`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every Teisoro dialog shows refusals, "saved" statuses and the lost-answer message that points at Check again as a row with an icon and text, focused when it appears and announced as `alert` or `status`. Scalewing has `Toast` (ephemeral) and `Text color`, but nothing persistent with an icon, a tone and a live-region role. Teisoro keeps an app component, `NoticeRow`, which gained a `warning` tone in S19 for the lost answer.
Existing surface this might already be: `Toast` (auto-dismissing, not in the flow of a form); `Text color="warning"` from teisoro-warning-tone.md.
Workaround I almost used: none; `NoticeRow` composes `Inline`, an icon and `Text`.
Teisoro use: `apps/teisoro-web/src/app/drawer-forms/NoticeRow.tsx` and its callers on `/vault`, `/vault/change-orders`, Get Change and every S17 and S18 dialog. Design: Teisoro `docs/design/vault/README.md` gap 8.
Proposed API: `Notice tone="info" | "success" | "warning" | "danger"`, `role?: 'status' | 'alert'` (default by tone), `icon?`, children; focusable when the consumer passes `tabIndex={-1}` and a ref, so a page can move focus to it.
Behavior and failure boundary: presentation and live-region semantics only; no dismiss timer. The consumer supplies the localized text.
