---
'@scalewing/react': minor
---

`Box` `border` accepts `'dashed'` as well as `true`: a hairline dashed border
in the `border` color token, for a space to fill in by hand such as a blank on
a printed form (see `docs/requests/teisoro-box-border-style.md`). Every
Box-based component takes it.

```tsx
<Box border="dashed" padding={2} radius="sm">
  {hint}
</Box>
```

New exported type `BoxBorder` (`boolean | 'dashed'`). Additive; `border` and
`border={true}` are unchanged.
