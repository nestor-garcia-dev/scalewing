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
