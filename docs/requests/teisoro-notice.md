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

## Follow-up: a pinned notice (Teisoro F-002-S25, 2026-09-26)

Missing surface: a notice pinned to a corner of the viewport (bottom end), over the page and clear of the safe areas, which the consumer can collapse to a small round button and expand again.
Why Box/Stack/Inline/Card/Text/Button cannot do this: no Scalewing surface positions content fixed to the viewport except `Toast`, which dismisses itself on a timer and is a `status` popover, not a persistent control with actions.
Teisoro use: the Close day reminder on the Services day (`apps/teisoro-web/src/app/services-day/CloseDayReminder.tsx`), which Angular floated in the bottom-right corner from an hour before closing until three hours after. Teisoro shows it in the page's flow until this ships. Design: Teisoro `docs/design/close-day-reminder/README.md`.
Proposed API: `Notice placement="inline" | "pinned"` (default `inline`); `pinned` renders fixed at the bottom end with the viewport's safe-area insets, stacked above page content and below dialogs. The tone may pulse when the consumer passes `emphasis="urgent"`, respecting `prefers-reduced-motion`.
Behavior and failure boundary: presentation only; the consumer owns the collapsed state and its button.
