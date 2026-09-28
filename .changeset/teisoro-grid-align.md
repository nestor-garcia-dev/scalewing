---
'@scalewing/react': minor
---

`Grid` takes `align` (`start`, `center`, `end`, `stretch`): where each child
sits in the height of its row, through the same generated `sw-align-*` classes
and `Align` type as `Stack` and `Inline` (see the 2026-09-28 follow-up in
`docs/requests/teisoro-grid.md`). `align="end"` keeps a row of fields level
when one label wraps:

```tsx
<Grid align="end" columns={2} gap={3}>
  {fields}
</Grid>
```

Additive; unset, no class is added and children stretch as before.
