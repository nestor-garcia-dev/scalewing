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

Status: merged in #101 (2026-10-09) and released in `@scalewing/react` 1.22.0 for Teisoro F-006-S11 task 1875; Teisoro pins and adopts it in task 1880.
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

## Follow-up request (2026-10-09, Teisoro F-006-S11, PR #65 review): a toggletip a tap opens

Status: implemented on branch `teisoro/f006-s11-info-tip` for the next `@scalewing/react` minor; pending review and release.
Source: the review of Teisoro PR #65 (blocking). The Services day shows an ⓘ beside the drawer's expected balance: a `Tooltip` (description) whose trigger is a ghost `Button` (44 px, `aria-label` "About the expected balance") with a no-op `onPress`. Since 1.22.0 (the 2026-10-08 follow-up above) a tap on a button presses it and never opens its tooltip, so on a phone or tablet the hint can never be read. The README's way out, "a trigger that does nothing else on a tap, such as a focusable badge", needs a 44 px focusable non-control, which Teisoro cannot draw (it owns no CSS) and which is the wrong semantics: a focusable thing a user presses is a button.
Renderer: react
Missing surface: `InfoTip`, the toggletip pattern: a ghost icon-only button whose only job is to show its tip, which a press opens.
Existing surface this might already be: `Tooltip` (a tap on a button acts, by design since 1.22.0); `Tooltip` on a `Badge tabIndex={0}` (not a 44 px target, not a button, and Teisoro owns no CSS to make it one); `Dialog` (a modal for one sentence of help).
Workaround I almost used: a focusable `Box` with `role="img"` and a `Tooltip`, or dropping the hint on touch screens.
Teisoro use: `<InfoTip content={t('…')} label={t('About the expected balance')}><Info aria-hidden size={16} /></InfoTip>` beside the drawer's expected balance, replacing the `Tooltip` with the no-op `Button`.
Proposed API: `InfoTip` and `InfoTipProps`: `label: string` (the button's accessible name), `content: string` (the tip, plain text as `Tooltip`'s `content`), `children: ReactNode` (the decorative glyph), `size?: ButtonSize` (default `md`). The ref reaches the `<button>`. New generated class `sw-info-tip`. No tokens.

```tsx
<Inline gap={1}>
  <Text>Expected waders: 128</Text>
  <InfoTip
    content="Counted at the last high tide, before the hides opened"
    label="About the expected waders"
  >
    <Info aria-hidden size={16} />
  </InfoTip>
</Inline>
```

Behavior and failure boundary:

- Built on `Tooltip`'s anchor (`tooltip/TooltipAnchor.tsx`), bubble and top-layer placement; nothing is duplicated. `Tooltip` is that anchor without `pressToggles`, an internal option `InfoTip` alone sets; it is not a public prop. Every other trigger behaves as before: a tap on a control does what it does and leaves its tooltip closed.
- Hover and a visible focus show the tip and pointer leave hides it, as `Tooltip`. A press of the button (a tap, a click, Enter or Space, all the button's `click`) shows the tip and keeps it shown when the pointer leaves; the next press hides it. A press while hover or focus already shows it keeps it shown (and says it, below), so the first Enter after a Tab is not a no-op for a screen reader user. A tap is handled as the click, not by the touch toggle. A press inside the bubble is not a press of the button.
- Escape (taken only while the tip shows, so a surrounding `Dialog` stays open), blur and a press outside hide it and undo the press, as `Tooltip`.
- The button is a ghost `Button`, `type="button"`, named by `label` (`aria-label`); the glyph is decorative. Square at every size; `md` and every size on a coarse pointer are 44 px (the `sw-calendar-button` rules, now generated by one shared function for both classes).
- Screen readers (decision): the tip is the button's description (`aria-describedby`), so it is read once on focus. That is not enough for a press: the focus does not move, so nothing new is announced, and a reader with descriptions or hints off (VoiceOver's hints setting, JAWS verbosity) never hears it, though pressing the button is the user's explicit request for it. So, as in the toggletip pattern, a visually hidden polite live region (`role="status"`, in the page from the first render and empty) is filled with the tip when a press opens it and emptied when it closes, so each press that opens it says it once. Hover and focus alone leave the region empty, so the description is not doubled on focus.
- No `disabled`: `Tooltip`'s `disabled` keeps the trigger and drops its help, which here would leave a button that does nothing. Where the tip is shown as text, render no `InfoTip`.
- No `aria-expanded` or `aria-controls`: the tip is not a region the button expands, and its text is already the description.
- An empty `label` or `content` throws a `RangeError`.

Rejected alternatives:

- A `Tooltip` prop such as `openOnPress`. A tooltip on a button that acts must not open on its press (the 2026-10-08 follow-up); the press-opens behavior belongs to a button that does nothing else, so it is a component, not an option on every trigger.
- A `data-` marker on the trigger that `tapActs` exempts. It would be a public attribute any trigger could set, and a tap toggle on pointer down cannot follow Enter and Space; the internal anchor option toggles on the button's own `click`.
- A focusable non-control (the README's badge advice). Wrong role, no 44 px target, and Teisoro owns no CSS.

Scalewing owns the component, its tests, the gallery and the changeset. Teisoro owns the words and the glyph.

Evidence: `packages/react/src/info-tip.test.tsx` (name, description, `type="button"`, classes, ref and an empty live region; a tap toggles and fills and empties the region; a mouse click toggles and a clicked tip stays when the pointer leaves; hover alone opens and closes; after a Tab, Enter and Space toggle and fill the region; Escape closes and is taken only while shown; a press outside and blur close and undo the press; a press inside the bubble does not toggle; no form submit by click, Enter, Space or tap; empty label or tip throws; regression: a `Tooltip` on a `Button` still does not open on a tap or a click and has no live region); `tooltip.test.tsx` and `tooltip-placement.test.tsx` unchanged and passing; `css/stylesheet.test.ts` (the `sw-info-tip` rules); `apps/gallery/e2e/info-tip.spec.ts` on desktop-en, mobile-es and forced-colors (description and 44 px target; on mobile-es a tap opens it, says it in the live region and keeps the bubble inside the screen, a second tap and an outside tap close it, the `sm` one is 44 px on touch; on desktop hover, a click that stays open and closes on the next click or outside; keyboard focus, Enter, Space, Escape and blur; the form is never submitted; at 390 px the glyph at the end of a row shows its bubble inside the screen).
