Scalewing request from Teisoro.

Status: proposed; implementation plan in Teisoro F-002-S05 task 500.
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
