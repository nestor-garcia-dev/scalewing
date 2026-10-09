Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002-S05 task 570; pending final independent review and commit.
Renderer: react
Missing surface: `Tooltip`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Native title is unreliable for keyboard and touch; a product popover and CSS would duplicate overlay behavior.
Existing surface this might already be: None.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Icon-only actions and truncated explanatory content in retained operational routes.
Proposed API: content, labelled trigger or anchor.
Behavior and failure boundary: Expose help on focus and hover, support touch access, and dismiss on Escape/blur. Tooltip content supplements an accessible name rather than replacing it. Consumer supplies localized text.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

Verification on 2026-09-19: `pnpm check` passed format, lint, 30 token tests, 76 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed all 18 Chromium runs across desktop English, mobile Spanish with touch, and forced-colors projects; the Tooltip mobile screenshot was inspected after the generated stylesheet build. Built `@scalewing/tokens` and `@scalewing/react` tarballs were installed via temporary overrides in a disposable detached Teisoro worktree. `pnpm verify:react` passed lint, 346 React unit tests at 100% coverage, boundary check, build, and 25 Chromium E2E journeys. The Teisoro task records the final review fingerprint and commit hash after commit.

## Follow-up request (2026-09-25, Teisoro F-002-S19 task 1060): a tooltip on a non-interactive badge

Status: requested; not started.

`Tooltip` needs a `trigger` that can take focus, which is right for icon buttons. Angular's vault movement cards carry an AUTO tag whose tooltip explains it ("Recorded by a Services drawer drop"); the tag is a `Badge`, which is not focusable, and wrapping it in a `Button` would announce an action that does nothing. React now shows the badge alone and the explanation is lost.

Proposed behavior: let `Tooltip` wrap a non-interactive trigger by making it focusable (`tabIndex=0`, no button role) and linking the content with `aria-describedby`, or give `Badge` an optional `description` that renders the same tooltip. Touch opens it on press, Escape and blur dismiss it, as today.

Teisoro use: `apps/teisoro-web/src/app/vault-page/MovementsCard.tsx`. Design: Teisoro `docs/design/vault/README.md`, Scalewing gap 5.

## Follow-up request (2026-10-08, Teisoro F-006-S11 task 1875): open on a visible focus, keep inside the screen

Status: implemented on `claude/teisoro-f006-s11-parts` for Teisoro F-006-S11 task 1875; pull request pending review.
Source: Teisoro UX review `admin-settings.md`, finding SET-9 (minor; the Scalewing part, F-007 task 1625 and the final check task 1640). Below 768 px the workspace's destinations are glyph buttons named by `Tooltip relationship="label"`. Two problems are Scalewing's: the tooltip opens on any focus (`onFocusCapture`), so a clicked or tapped glyph keeps its name shown on the next page until the focus moves, and a tap toggles it too; and the bubble is placed at the anchor's start edge with `position: absolute`, so a trigger near the screen's right edge pushes it off the screen.

Teisoro need: a tooltip that a pointer press never leaves open, and a bubble that stays on screen for a trigger at the end of a header.

Behavior and failure boundary (no API change):

- The focus handler opens the tooltip only when the focused element matches `:focus-visible` (`tooltip/tooltip-open.ts`, `focusIsVisible`). A browser that throws on the selector counts the focus as visible, as before. Hover is unchanged.
- The touch toggle runs only when the tap does not land on an acting control inside the anchor (`tapActs`: `a[href]`, `area[href]`, `button`, form controls and `label`, `summary`, `audio` and `video` with controls, an editable region (`contenteditable` other than `false`), and the widget roles button, checkbox, combobox, link, menuitem, menuitemcheckbox, menuitemradio, option, radio, searchbox, slider, spinbutton, switch, tab, textbox and treeitem). A tap on such a control closes the tooltip and does what the control does. A trigger that does nothing else on a tap, such as a `Badge` with `tabIndex={0}`, still toggles its help, and a tap outside still dismisses it.
- While shown, the bubble is a manual popover on the top layer (`tooltip/use-tooltip-placement.ts`), placed by the same `placePopover` as `ActionMenu` and `CalendarButton` (now exported from `use-anchored-popover.ts`): a `space-1` gap under the anchor (over it when only that fits), lined up with the anchor's start or, with `flipInline`, its end, kept a `space-2` inset from every edge, and moved on scroll, resize and a change in either element's size. While hidden it stays in the DOM with `hidden` and no `popover` attribute, so a `label` tooltip still names its trigger. Without the popover API it keeps the fixed placement. The generated `.sw-tooltip` is `position: fixed; inset: auto; margin: 0` with `max-width: min(18rem, calc(100% - 2 * var(--sw-space-2)))` (100% of the top layer is the viewport without a classic scrollbar).

Rejected alternatives:

- An `openOn` prop. The pointer cases are not a preference: a tooltip that a click leaves open is a defect for every consumer, and hover covers a mouse.
- Keeping the tap toggle on buttons. The tap already acts; on a link the help then stands over the next page, which is SET-9's report.
- CSS anchor positioning. Not in every browser Teisoro supports.

Evidence: `tooltip.test.tsx` (a tap on a non-acting trigger toggles and an outside tap dismisses; a tap on a button or its glyph does not open and the button still presses; a tap on each other kind of control (combobox, slider, spinbutton, textbox, menuitemcheckbox and treeitem roles, a label, a video with controls) leaves it closed; a focus opens only when `:focus-visible` matches, and does when the selector throws; the label tooltip opens on hover and focus, not a tap); `tooltip-placement.test.tsx` (a 200 px bubble from a trigger at 340 px on a 390 px screen is lined up with the trigger's end at 180 px, 4 px under it; the bubble is a manual popover only while shown and still names its trigger; the generated rule); `apps/gallery/e2e/tooltip.spec.ts` on desktop-en, mobile-es and forced-colors: a tap presses "Sighting details" and leaves its help closed, a tap on the "Protected" badge toggles its help, a click focuses the button without opening it, Tab opens it; the range map's tap opens the destination without its name; at 390 px a badge fixed 8 px from the right edge shows its bubble under it and inside the screen.
