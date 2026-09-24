---
'@scalewing/react': minor
---

Add `columnSpan` to `Box` and every component built on it (`Stack`, `Inline`,
`Card`, `Grid`, …), so a direct child of a `Grid` can cover 1, 2, 3, 4 or 6
columns (see `docs/requests/teisoro-grid-column-span.md`). Three columns with a
two-column child give a two-to-one page:

```tsx
<Grid columns={3} columnsBelow={{ md: 1 }} gap={4}>
  <Stack columnSpan={2} gap={4}>
    {form}
  </Stack>
  <Card variant="outlined">{panel}</Card>
</Grid>
```

The generated `sw-grid-span-{1,2,3,4,6}` classes are capped at the
columns the grid has at the current width, so a span never adds an implicit
column and `columnsBelow` still stacks the page on a phone. A span outside the
catalog throws a `RangeError`. New exported types: `GridColumnSpan`,
`ColumnSpanProps`. Additive; no existing class or prop changes.
