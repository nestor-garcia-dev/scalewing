---
'@scalewing/react': minor
---

New `ActionBar`: a long page's actions and one short `status` line on a glass
bar that sticks to the bottom of the viewport while the content above it
scrolls, then rests in place after it (see
`docs/requests/teisoro-action-bar.md`). `stickyBelow="md"` sticks only below
the `md` breakpoint and keeps the bar in page flow from `md` up. The bar clears
the safe-area insets (with `viewport-fit=cover`), is solid under Reduce
Transparency, and on a phone puts the status on its own line with the actions
sharing the row under it.

```tsx
<Stack gap={4}>
  {longForm}
  <ActionBar status="Draft saved at 5:00 PM" stickyBelow="md">
    <Button variant="secondary" onPress={save}>
      Save draft
    </Button>
    <Button onPress={finish}>Finish</Button>
  </ActionBar>
</Stack>
```

New generated classes `sw-action-bar`, `sw-action-bar-status`,
`sw-action-bar-actions`, `sw-action-bar-sticky` and
`sw-action-bar-sticky-below-md`; new exported types `ActionBarProps` and `Breakpoint` (the breakpoint names
`stickyBelow`, `hideBelow` and `columnsBelow` already take, today only
`'md'`). Additive.
