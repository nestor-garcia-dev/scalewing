---
'@scalewing/react': minor
---

`DateField` takes `entryLocale` (BCP 47, validated like `locale`). It sets
only the typed entry: its field order, separator, placeholder and display
text. Month and weekday names, spoken dates and the calendar keep `locale`.
`Intl` writes every Spanish locale day first, so a product that keeps an
`MM/DD/YYYY` entry in Spanish pairs them (see the 2026-09-28 follow-up in
`docs/requests/teisoro-date-field.md`).

```tsx
<DateField
  label="Fecha de liberación"
  locale="es-US"
  entryLocale="en-US"
  value={liberacion}
  onChange={setLiberacion}
/>
```

Additive; `entryLocale` defaults to the resolved `locale`, so existing fields
keep their typed order. A malformed tag throws a `RangeError`.
