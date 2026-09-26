Status: in progress (react-native). The native example shows a settings
group, a choice group, and read-only rows.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: a grouped list of rows that open another screen, pick one
option in place, or only show a value.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas builds
these rows four ways today (a pressed Card, a Card with a product chevron,
a pressable `TableRow` with a Lucide chevron, and a `TableRow` with a Lucide
check). A phone test on 2026-09-26 found them hard to tell apart from
buttons and from information cards ("it was a bit difficult to know that
those were clickable"). The owner chose grouped rows with a grey chevron
(FutMas canvas boards 17 and 19). Table is for data columns, `CheckList`
is private to the select `list` variants, and a Card per row cannot draw
one panel with hairlines between rows.
Existing surface this might already be: `Table`/`TableRow` (data rows with
columns and density), `MultiSelect`/`SingleSelect` `variant="list"`
(controlled value over items, not navigation), and `Card` (one object).
Workaround I almost used: a FutMas `ListRow` with its own chevron glyph,
spacing, and pressed state.
Proposed API (reusable names only):

```tsx
<ListGroup accessibilityLabel="League">
  <ListRow detail="Draft · 12 teams" onPress={open} title="Spring 2027" />
  <ListRow title="City" value="Austin" />
  <ListRow onPress={pick} selected title="Sunday" />
</ListGroup>
```

- `ListGroup` is one bordered panel on `surface` with hairlines between
  its rows. `accessibilityLabel` is optional.
- `ListRow` takes `title`, an optional muted `detail` line, an optional
  trailing muted `value`, and an optional `leading` slot (a consumer mark
  or Lucide glyph, ADR 0008).
- With `onPress` the row is a button and shows a chevron (control chrome,
  drawn like the Accordion's). `accessory="none"` hides it for a row that
  acts in place.
- `selected` makes the row a choice: a check when true, nothing when
  false, and `accessibilityState.selected` either way; it never shows a
  chevron.
- Without `onPress` the row is read-only: no chevron, no pressed state,
  one accessible text element.
- `disabled` dims the row and blocks presses.
- The accessible name defaults to the title, detail, and value joined with
  commas; `accessibilityLabel` replaces it.

The plan named a `check` accessory. `selected` replaced it so an unselected
choice row still announces its state.

Behavior and failure boundary: pressed rows fill with `subtle`; the
chevron, check, and value never take a press of their own. Scalewing owns
the panel, row spacing, hairlines, chevron, check, and pressed fill. FutMas
owns titles, details, values, leading marks, and what a press does.
