Status: in progress (react-native). Native-example will show compact numeric rows.

Scalewing request from futmas.

Renderer: react-native
Missing surface: Table (compact row/cell layout for scores and standings)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Those primitives can fake a grid, but scores and standings need shared
density, hairline row rules, numeric/end alignment, and tabular figures.
Web already has Table; native has no equivalent. Card rows are too tall for
a match list.
Existing surface this might already be: web Table (DOM only). Card. Inline.
Workaround I almost used: stacked Cards, hex padding, or a product-only
MatchRow kit that would fork the web table language.
Proposed API (reusable names only):
<Table density="compact">
  <TableHeader><TableRow><TableCell header numeric>...</TableCell></TableRow></TableHeader>
  <TableBody><TableRow><TableCell truncate>...</TableCell></TableRow></TableBody>
</Table>
Not an HTML table. Product copy stays in the consumer. Do not name it
StandingsTable or MatchList.
