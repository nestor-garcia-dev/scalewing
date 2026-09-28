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

New generated classes `sw-border` and `sw-border-dashed` and a new exported
type `BoxBorder` (`boolean | 'dashed'`). `border` and `border={true}` look the
same as before, but the solid hairline is now the `sw-border` class instead of
an inline `style.border`; a consumer `style` still wins, and the prop still
wins over a Box-based component's own frame. A test that read
`element.style.border` should check the class instead. Additive for the
public API.
