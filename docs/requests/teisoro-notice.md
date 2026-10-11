Scalewing request from Teisoro.

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); released in `@scalewing/react` 1.28.0 (PR #118; Teisoro F-011-S03, release R2 "feedback", item 5; the redesign inventory's row 20). The pinned-notice follow-up below stays unbuilt.
Renderer: react
Missing surface: an inline notice (banner) with semantic tones, `info`, `success`, `warning` and `danger`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every Teisoro dialog shows refusals, "saved" statuses and the lost-answer message that points at Check again as a row with an icon and text, focused when it appears and announced as `alert` or `status`. Scalewing has `Toast` (ephemeral) and `Text color`, but nothing persistent with an icon, a tone and a live-region role. Teisoro keeps an app component, `NoticeRow`, which gained a `warning` tone in S19 for the lost answer.
Existing surface this might already be: `Toast` (auto-dismissing, not in the flow of a form); `Text color="warning"` from teisoro-warning-tone.md.
Workaround I almost used: none; `NoticeRow` composes `Inline`, an icon and `Text`.
Teisoro use: `apps/teisoro-web/src/app/drawer-forms/NoticeRow.tsx` and its callers on `/vault`, `/vault/change-orders`, Get Change and every S17 and S18 dialog. Design: Teisoro `docs/design/vault/README.md` gap 8.
Proposed API: `Notice tone="info" | "success" | "warning" | "danger"`, `role?: 'status' | 'alert'` (default by tone), `icon?`, children; focusable when the consumer passes `tabIndex={-1}` and a ref, so a page can move focus to it.
Behavior and failure boundary: presentation and live-region semantics only; no dismiss timer. The consumer supplies the localized text.

## Accepted API (2026-10-11, Teisoro F-011-S03)

The F-011 canvas has 26 boards with a note in the flow (danger 7, warning 7, info 12): a tinted block, a bold lead and a sentence in the tone's dark ink ("**$30.00 short.** The customer has not handed over enough…"), sometimes an action at the end ("Open Tasks"), and on the danger boards a field and a confirming checkbox inside (DrawerAudit, CloseDay4).

- `Notice` (props `NoticeProps`, `NoticeTone`, `NoticeRole`, `noticeTones`): `tone: 'info' | 'success' | 'warning' | 'danger'` (required), `title?: string` (a bold lead), `children?` (the message), `action?: ReactNode` (one link or small `Button` ending the row), `icon?: ReactNode` (a consumer glyph, `aria-hidden`), `role?: 'status' | 'alert' | 'none'` (default `alert` for danger, `status` otherwise; `none` renders no live region, for a note that is part of the page from the start), a forwarded ref and the `div`'s HTML attributes (so `tabIndex={-1}` makes it a focus target).
- A text message (values interpolated in it included) shares the title's row while it fits and wraps under it otherwise; a message with any element (a `span`, or a sentence and a `Checkbox` or `Field`) is stacked under the title, a `space-2` gap apart. Empty parts (`false`, `null`) are dropped. Inside a notice `--sw-color-muted` is the ink, so a field's or a checkbox's description keeps 4.5:1 on the fill; controls otherwise keep their own colors (a checked box is the accent, where DrawerAudit tints it red).
- Announcement: an `alert` that appears is announced; a `status` mounted together with its words is not reliably, so a page that needs it heard keeps the Notice mounted and changes its words, or moves focus to it (`tabIndex={-1}`). A small `Button` action overhangs the padding so a one-line note stays one line tall.
- Colors (no new tokens): the fill is the tone mixed 10% into `surface`, or `accentSubtle` for info (ADR 0011); the words are the tone mixed 30% toward `text`, so they read darker than the tone on a light fill, as the boards' warning and info ink does (`#8A4600`, `#0A4F9E`); the boards' danger words are the bare red (`#C4291C`), so Scalewing's danger ink is a little darker than the board. They keep 4.5:1 on the fill in every palette and scheme except harvest dark and mocha dark danger, whose bare danger is already under 4.5:1 on their surface; there the note is still more readable than that (`notice.test.tsx`). Forced colors draw a border in place of the fill.
- Failure boundary: an unknown `tone` or `role`, a blank `title`, or neither a title nor a message throws a `RangeError`. No timer, no close button. Teisoro owns the copy, when a note shows, and where focus goes.
- Sizes on Scalewing's scale (Teisoro D-2): label type 15/20 (the boards' 14/20), padding `space-2` × `space-3` (8 × 12; the boards' 10 × 12), radius `sm` 8 (the boards' 10 and 12). Generated classes `sw-notice`, `sw-notice-<tone>`, `sw-notice-icon`, `sw-notice-content`, `sw-notice-stacked`, `sw-notice-title`, `sw-notice-body`, `sw-notice-action`.

Evidence: `notice.test.tsx` (roles by tone, `none`, reading order, the stacked message, the hidden glyph, focus, failures, the generated tone rules, contrast in every palette and scheme, interpolated and empty messages); gallery section "Notice"; `apps/gallery/e2e/notice.spec.ts` on desktop-en, mobile-es and forced-colors (roles, 4.5:1 on the painted fill, the row and the stacked layout, a field (its description at 4.5:1) and the checkbox inside, the forced-colors border).

## Follow-up: a pinned notice (Teisoro F-002-S25, 2026-09-26)

Status: no Teisoro consumer. Teisoro's product owner decided on 2026-09-26 not to migrate the Close day reminder, and Teisoro F-002-S25 task 1090 removed it, so the files named below no longer exist. Kept as a record; build it only if another consumer needs a pinned notice.

Missing surface: a notice pinned to a corner of the viewport (bottom end), over the page and clear of the safe areas, which the consumer can collapse to a small round button and expand again.
Why Box/Stack/Inline/Card/Text/Button cannot do this: no Scalewing surface positions content fixed to the viewport except `Toast`, which dismisses itself on a timer and is a `status` popover, not a persistent control with actions.
Teisoro use: the Close day reminder on the Services day (`apps/teisoro-web/src/app/services-day/CloseDayReminder.tsx`), which Angular floated in the bottom-right corner from an hour before closing until three hours after. Teisoro shows it in the page's flow until this ships. Design: Teisoro `docs/design/close-day-reminder/README.md`.
Proposed API: `Notice placement="inline" | "pinned"` (default `inline`); `pinned` renders fixed at the bottom end with the viewport's safe-area insets, stacked above page content and below dialogs. The tone may pulse when the consumer passes `emphasis="urgent"`, respecting `prefers-reduced-motion`.
Behavior and failure boundary: presentation only; the consumer owns the collapsed state and its button.
