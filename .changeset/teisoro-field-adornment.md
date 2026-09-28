---
'@scalewing/react': minor
---

`Field` takes `prefix` and `suffix`: short text inside the control's frame
before or after the value, such as a currency sign or a unit (see
`docs/requests/teisoro-field-adornment.md`).

```tsx
<Field label="Drop amount" prefix="$">
  <input inputMode="decimal" name="drop" />
</Field>
```

The text is not part of the value. The generated `sw-field-adorned` wrapper
draws the control frame and focus ring, `sw-field-prefix` and
`sw-field-suffix` are muted, and the input is named by its label plus the
adornment ("Drop amount $") through `aria-labelledby`. An input that names
itself with its own `aria-label` or `aria-labelledby` keeps that name, and the
adornment joins its `aria-describedby` instead. A press on the prefix, the
suffix or the frame focuses the input. Adornments need one
native `<input>` child; anything else throws a `TypeError`. Additive; an
unadorned `Field` renders as before.
