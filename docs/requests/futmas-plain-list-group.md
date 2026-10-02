Status: implemented for the react-native 1.14.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: choices inside an open accordion drawn as plain rows with
hairlines, without a second bordered, rounded panel inside the first.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's owner
rejected the card-in-a-card look of its season and competition pickers
(FutMas F-019-S05, canvas boards S1–S3, approved 2026-10-02). `ListGroup`
always draws its own panel, and `Accordion` always pads its content, so a
consumer can only restyle rows by hand in each picker.
Existing surface this might already be: `ListGroup` and `Accordion`; this
adds an option to each rather than a new component.
Workaround I almost used: a FutMas list of `ListRow`s with hand-drawn
hairlines in each of three pickers.
Proposed API (reusable names only):

```tsx
<Accordion
  flush
  open={open}
  onOpenChange={setOpen}
  title="Fall 2026"
  accessibilityLabel="Choose a season"
>
  <ListGroup variant="plain">
    <ListRow selected title="Fall 2026" onPress={choose} />
  </ListGroup>
</Accordion>
```

Behavior and failure boundary: `plain` drops the panel and adds a hairline
above the first row; `flush` drops the accordion content's side and bottom
padding. Defaults stay as they are.

Scalewing owns both options, their styles, tests, docs, and the native
example. FutMas owns what each picker lists and its copy.
