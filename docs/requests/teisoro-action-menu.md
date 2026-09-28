Scalewing request from Teisoro.

Status: implemented locally for Teisoro F-002-S05 task 500; release and Teisoro pin remain in task 610.
Renderer: react
Missing surface: `ActionMenu`, a reusable labelled trigger and menu of independent commands.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Those primitives do not own the popup, command-menu keyboard model, focus restoration, outside dismissal, or generated control styling. Product composition would create a parallel control skin. `Select` is a value listbox; its optional trailing action cannot express several independent commands and must not turn a command into the selected value.
Existing surface this might already be: `Select` for selecting one value, `Dialog` for confirmation, `Button` for a single immediately visible action. None owns a compact command menu.
Workaround I almost used: a product-owned popover of buttons with local CSS or a sentinel-valued `Select`.

Initial Teisoro uses:

- Authenticated shell language and account commands.
- Employee row edit, deactivate/reactivate, and administrator-only delete commands.
- Shared period selector and daily dashboard commands when those routes migrate.

Proposed public API (final shape may be refined during implementation):

```tsx
<ActionMenu
  label="Employee actions"
  items={[
    { id: 'edit', label: 'Edit', onSelect: editEmployee, icon: editIcon },
    { id: 'deactivate', label: 'Deactivate', onSelect: deactivateEmployee },
    {
      id: 'delete',
      label: 'Delete',
      onSelect: deleteEmployee,
      destructive: true,
    },
  ]}
/>
```

The consumer supplies localized labels, icons, visible items, and authorization-aware callbacks. Scalewing owns the labelled trigger, accessible menu semantics, focus, keyboard and pointer interaction, dismissal, disabled and destructive presentation, and generated CSS. The item `id` is a stable rendering identifier, not a selected value. The menu must not execute a disabled item or invoke an enabled callback twice. Escape returns focus to the trigger; outside interaction closes without an action. The consumer owns any confirmation dialog and server authorization.

## Follow-up request (2026-09-24, Teisoro F-002-S17 task 930): focus the trigger before `onSelect`

Status: merged in PR #42 (`f3f5892`) and released in `@scalewing/react` 1.6.0 (tag `react-v1.6.0`). `select` now calls `close(true)` before `onSelect`, the same focus return Escape uses. Unit test `action-menu.test.tsx` and Chromium check `apps/gallery/e2e/action-menu.spec.ts` (a gallery command opens a confirmation `Dialog`; closing it by Escape or a button returns focus to the trigger).

Selecting an item hides the focused menu item and then runs `onSelect`, but focus is not returned to the trigger first. Escape does return it. When `onSelect` opens a `Dialog` (Teisoro's admin "Discard draft" on the closeout day), the native `showModal()` records no useful opener: the focused element was the item that was just hidden. Closing the dialog then leaves focus on the page body instead of on the menu trigger, so keyboard and screen-reader users lose their place.

Proposed behavior: on selection, close the menu and move focus to the trigger before calling `onSelect`, as Escape already does. A dialog opened from `onSelect` then records the trigger as its opener, and the browser returns focus to it on close. No API change is needed.

Teisoro did not work around this in product code. Its Chromium check (`apps/teisoro-web/e2e/closeout-day-preview.spec.ts`) asserts only that focus enters the discard dialog, and the gap is listed in `docs/design/daily-closeout/README.md`.

## Follow-up request (2026-09-25, Teisoro F-002-S19 task 1060): checked items for a period picker

Status: requested by Teisoro F-002-S19 task 1060 (2026-09-25); not started.
Missing surface: a period picker, a menu button whose items carry a checked state.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Angular's vault movements header is ‹ label ▾ › where ▾ opens Day, Week, Month and Year with a check on the current one and a calendar entry. `ActionMenu` items run commands and have no checked state, so Teisoro uses a `Select` labelled "Period" beside the ‹ › buttons and a separate "Jump to date" `DateField`: three controls where Angular had one.
Existing surface this might already be: `ActionMenu` (commands, no `menuitemradio`); `Select`; `SegmentedControl` (too wide for four choices beside the arrows at 390 px).
Workaround I almost used: `ActionMenu` items with a check glyph in the label.
Teisoro use: the Recent transactions period controls on `/vault` (`apps/teisoro-web/src/app/vault-page/MovementsCard.tsx`), and the read-only `/vault/history`. Design: Teisoro `docs/design/vault/README.md` gap 4.
Proposed API: `ActionMenu` items gain `checked?: boolean` (rendered as `menuitemradio` with `aria-checked` inside a group), so a period picker is an `ActionMenu` whose trigger shows the current label; an optional item may open a `DateField` popover.
Behavior and failure boundary: keyboard and focus as `ActionMenu` today; the consumer owns the periods, labels and date arithmetic.

## Follow-up request (2026-09-28, Teisoro F-007-S04 task 1305): a gap from the trigger and an inset from the screen edge

Status: merged in #68 (2026-09-28) and released in `@scalewing/react` 1.10.1; Teisoro pins it in F-007-S04 task 1310.
Source: Teisoro UX review `closeouts-closeout-day-and-prior-day.md`, finding DAY-8 (the closeout day's "More actions for Register 2" menu).

The menu's left edge started at the trigger and was clamped only to `window.innerWidth - width`: a trigger at the end of a card row pushed the menu flush against the screen edge (x 1137 to 1280 at 1280 px; flush to 390 on a phone), past the card, and it sat directly on the trigger with no gap. `ActionMenu` had its own positioning and outside-press code beside the shared `anchoredPosition` helper and `useAnchoredPopover` hook that the `DateField` calendar uses.

Behavior:

- The open menu uses `useAnchoredPopover` (moved from `components/date-field/` to `components/`, since it now serves two surfaces): a `space-1` gap below the trigger, or above it when it only fits there, and a `space-2` inset from every viewport edge, the same tokens as the calendar. The hook also owns the popover layer, scroll and resize, and the outside press.
- `anchoredPosition` gains an opt-in `flipInline`: when the popover would cross the viewport's inline end aligned to the anchor's start, it lines up with the anchor's end instead, if that fits (mirrored in right-to-left). `ActionMenu` turns it on; the calendar keeps its placement.
- The menu is rendered only while open (`ActionMenuList`, `components/action-menu/`), so the hook shows and places it on mount, as it does the calendar.
- The menu resets the popover layer's `inset: 0` (`inset: auto`, as the calendar does), so the placed `left` holds in a right-to-left document instead of the menu snapping to the right edge.
- The menu is as wide as its longest command (`width: max-content`, at least the 44 px control height) up to the viewport less both insets (`100%` of the top layer, which leaves out a classic scrollbar). A longer command wraps, a word at a time if it must, instead of running off the screen.
- The shared placement measures the viewport as the root element's client box, not `window.innerWidth` and `innerHeight`, which include a classic scrollbar; the calendar's `max-width` moves from `100vw` to `100%` of the top layer too. Where the popover API is missing, a fixed popover inside a glass surface (whose backdrop filter makes it the containing block) is placed and capped against that surface; the popover API is supported in every browser Scalewing targets.
- The shared placement also runs when the popover or its anchor changes size while open (a `ResizeObserver` on both, where the runtime has one), as `ActionMenu`'s own `positionMenu` did on every focus change: commands that change while the menu is open no longer leave it where the old size put it. An anchor that moves without changing size (content inserted above it while the menu is open, with no scroll) is not followed; watching the whole layout for that was not worth the cost, and a scroll or resize re-places the menu.

No API change. Teisoro needs no code change: its "More actions" trigger ends the card row, so its menu now lines up with the trigger's end.

Rejected alternatives:

- An `align="end"` prop, as DAY-8 suggested. The menu picks the end itself when the start does not fit, which covers every trigger that ends a row; a prop would make each consumer guess the viewport. It can be added later if a consumer needs end alignment where the start fits.
- Adding a gap and inset to `positionMenu` in `ActionMenu` only. It would keep a second copy of the placement, popover and outside-press code that already drifted from the calendar's.
- Flipping the calendar too. `DateField` and `CalendarButton` are other surfaces; their placement was not part of the finding.

Evidence: `anchored-position.test.ts` (`flipInline`: start kept when it fits, end at the row end, the inset clamp when neither fits, right-to-left, above near the bottom); `action-menu.test.tsx` (the menu's `left` and `top` at a 390 px viewport; the popover layer and the menu rendered only while open); `apps/gallery/e2e/action-menu.spec.ts` "opens a gap below its trigger and clear of the screen edge" on desktop-en, mobile-es (390 px) and forced-colors, with the gallery's new end-of-row menu ("More actions for Snow leopard"); "keeps its placed left in right-to-left text" and "wraps a long command inside the screen" (the gallery's Spanish menu "Acciones del avistamiento") on the same three projects, and `action-menu-scrollbar.spec.ts` with a 15 px classic scrollbar, all added after the PR #68 code review; `action-menu.test.tsx` "fits the viewport without a classic scrollbar" and "moves the open menu when its commands change size"; `css/stylesheet.test.ts` (the list's `inset`, width and caps).

## Follow-up request (2026-09-28, Teisoro F-007-S04 task 1305): a 44 px touch target on a coarse pointer

Status: merged in #68 (2026-09-28) and released in `@scalewing/react` 1.10.1; Teisoro pins it in F-007-S04 task 1310.
Source: Teisoro UX review `closeouts-closeout-day-and-prior-day.md`, finding DAY-9, the Scalewing part (Teisoro owns its own button sizes).

The trigger and its commands use `min-height: var(--sw-control-xs-min-height)`, 28 px: the closeout day's ⋮ trigger measured about 37 × 28 px on a phone, beside the card's Start and Continue, where a mis-tap opens Discard. That passes WCAG's 24 px minimum but not the 44 × 44 px target of Teisoro's rubric.

Behavior: under `@media (pointer: coarse)` the trigger is at least `--sw-control-md-min-height` (44 px) tall and wide, and every command is at least that tall. A fine pointer keeps the compact xs height, so desktop toolbars do not change. This is the convention `CalendarButton` introduced (`sw-calendar-button`: at least the md control height on a coarse pointer at every size); the touch-target value and the coarse-pointer query now live in one internal module, `css/touch-target.ts`, that both use.

No API change. Teisoro needs no code change for the trigger; its own `Button size="sm"` actions remain its part of DAY-9.

Rejected alternatives:

- A `size` prop (`xs`, `sm`, `md`), as DAY-9 offered. Every known use is compact chrome on desktop and a thumb target on a phone, which is what the pointer tells apart; a size would make each consumer pick one height for both and add public API with no case yet. It can be added if a product needs a large trigger on a fine pointer.
- A 44 px trigger at every pointer. It would enlarge desktop toolbars and table rows, where the compact trigger is the point.
- Growing only the trigger. The commands are what a finger presses next; at 28 px, Discard would stay the small target the finding is about.
- An invisible enlarged hit area (a pseudo-element) around a 28 px trigger. It overlaps neighbouring controls in a tight row and is not what `CalendarButton` does.

Evidence: `css/stylesheet.test.ts` (the coarse-pointer rules after the xs sizes); `apps/gallery/e2e/action-menu.spec.ts` "gives its trigger and commands a 44 px target on a coarse pointer": at least 44 × 44 for the glyph and text triggers and 44 px commands on mobile-es (touch, coarse pointer), and under 32 px on desktop-en and forced-colors. The same spec file now emulates forced colors for its forced-colors project, as the other specs do.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): `align="end"` for a trigger that ends a card

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-entries.md`, finding ENT-13 (minor).

On the Services day at 1280 px, an entry's "…" trigger ends its card (x 1161–1199) but not the viewport, so the 1.10.1 placement kept the menu on the trigger's start: it ran 5 px past the card's right edge, and its "Void" command ended on the next row's "…" trigger. The 2026-09-28 DAY-8 follow-up above rejected an `align` prop because the flip covered every trigger then known to end a row at the screen edge; this one ends a card, not the screen.

Behavior:

- `ActionMenu` gains `align?: 'start' | 'end'` (default `'start'`, the current placement; exported type `ActionMenuAlign`). With `'end'` the menu's inline end lines up with the trigger's inline end (mirrored in right-to-left). The flip still applies the other way: an end-aligned menu that would cross the viewport's start takes the trigger's start.
- The shared `anchoredPosition` gains the matching `align` option, and `flipInline` now means "take the other edge when the preferred one does not fit" for either preference. `useAnchoredPopover` passes it through. The calendar keeps its start placement.

The rest of ENT-13 is already in 1.10.1 (DAY-8): the menu keeps a `space-1` gap from its own trigger and opens above it when it does not fit below with the `space-2` inset. With `align="end"` the Teisoro menu sits inside its card; it can still reach down over the next card's row, as any menu opens over the content below it.

Rejected alternatives:

- Choosing the end automatically when the trigger "ends its row" (the review's other option). The placement code sees the trigger and the viewport, not the card; finding the card would mean guessing which ancestor is the row. The consumer knows its layout and says so with one prop.
- Keeping a gap from, or flipping away from, any other trigger the menu would cover (the review's gap suggestion). A menu is a popup over the page: it covers what is below it by design, is drawn on top, and closes on a press outside, so a press on the covered trigger closes the menu rather than acting on the wrong row. Searching the page for other triggers to avoid would make the placement depend on unrelated content.

Evidence: `anchored-position.test.ts` (`align: 'end'` preferred where the start fits, falling back to the start, mirrored in right-to-left); `action-menu.test.tsx` "lines up with the trigger end with align end, where the start would fit" (the review's 1280 px geometry: left 1140 with `align="end"`, 1161 by default); `apps/gallery/e2e/action-menu.spec.ts` "ActionMenu with align end stays over the card its trigger ends" on desktop-en, mobile-es and forced-colors, with the gallery's two cards in a row ("Actions for Red fox"): the menu's end is at the trigger's end, inside the card, a gap below the trigger, and Escape returns focus.
