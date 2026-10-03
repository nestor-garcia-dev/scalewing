Status: implemented on `futmas/score-entry` for the next `@scalewing/react-native` minor release.

Scalewing request from FutMas.

Renderer: react-native
Change to an existing surface: native `Field` takes `variant="search"`, a
filled search box with a consumer glyph and a clear button.
Why: the goal-scorer sheet (FutMas canvas board W3) opens with a search
field over a roster of up to about 25 players. An outlined `Field` puts a
visible label above a bordered form control; a search box in the quiet
visual language is a filled capsule with a magnifier, no label above, the
search return key, and a way to clear the text.
Existing surface this might already be: `Field` itself; this adds a
variant rather than a parallel search component.
Workaround I almost used: a FutMas `TextInput` in a filled `Box` with a
Lucide magnifier and an X button beside it.
Proposed API (reusable names only):

```tsx
<Field
  clearLabel="Clear search"
  label="Search players"
  leading={
    <Search
      color={theme.colors.muted}
      size={theme.space[4]}
      strokeWidth={1.75}
    />
  }
  onChangeText={setQuery}
  placeholder="Search"
  value={query}
  variant="search"
/>
```

- `variant?: 'outlined' | 'search'`; `outlined` is today's field and the
  default.
- With `search`, `clearLabel: string` is required: the clear button's
  accessible name (product copy). An empty one throws.
- `leading?: ReactNode`: the consumer's glyph at the start (Lucide,
  ADR 0008), hidden from assistive technology.
- `label` is not drawn; it stays the input's accessible name, and the
  input takes the `search` accessibility role.
- `returnKeyType` defaults to `search`; the consumer may pass another.
- The clear button shows while there is text and the field is enabled,
  and calls `onChangeText('')`. With `testID` it is `<testID>-clear`.
- `hint`, `error`, `disabled`, and the other text-input props keep working;
  `rows` is not available on a search field.

Visual: a capsule filled with the `subtle` colour, no hairline at rest,
the outlined field's accent border on focus and danger border on an error.
The clear button is private control chrome: a muted disc with a cross in
the surface colour, in a control-height square at the frame's end. The
text keeps the 2026-09-21 rule from `futmas-native-field.md`: no fixed
`lineHeight` on the input, so the native input sizes its own line box and
glyphs are not clipped.

Scalewing owns the frame, the clear button, and the semantics. FutMas owns
the label, placeholder, clear label, glyph, and what the query filters.
