Scalewing request from fantasy-football.

Status: declined. Pointer cursor on a whole table row hides nested Button
CTAs (My pick / Gone). Keep the default cursor on the row; Buttons keep
pointer. Do not re-add `TableRow` `interactive` for this product.

Renderer: react
Missing surface: `TableRow` `interactive` (prop on the existing primitive)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
A ranked table row can be the disclosure control. Accordion is
`details`/`summary` and cannot be a `tr`. Button cannot wrap a row. The
row still needs the same pointer cursor as Accordion summary so hover
shows it is pressable.
Existing surface this might already be: TableRow. Accordion already sets
`cursor: pointer` on summary; that class does not apply to table rows.
Workaround I almost used: `style={{ cursor: 'pointer' }}` in product JSX,
app CSS on `tr`, wrapping the row in a Button.
Proposed API: `<TableRow interactive>`. Default stays the document cursor
for static rows.
