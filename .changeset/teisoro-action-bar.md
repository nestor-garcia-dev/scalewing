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
sharing the row under it. The status is a polite live region
(`role="status"`), always rendered so the first status is announced too; an
empty status takes no room.

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

Every generated `z-index` now comes from one stacking order
(`src/css/stacking.ts`): sticky table cells 1, the ActionBar 2, a glass `Card`
or `Accordion` holding an open popup 3 (was 1), the sticky `AppHeader` 4 (was
2), and popups 10 (the `Select` list was 3). An open `Select`, `ActionMenu`
or `Tooltip` inside a glass surface now paints over a stuck ActionBar, and
still under the AppHeader. An app that layered its own element between these
values should check it against the new numbers.
