Status: implemented for the react-native 1.6.0 release.

Scalewing request from FutMas.

Renderer: react-native
Change to an existing surface: native `Accordion` takes a `subtitle` and an
opt-in `truncateTitle`.
Why: the FutMas Matches tab groups a day's games by division table (approved
F-017-S04 plan, 2026-09-23). Each group header names the table on one line,
such as "Riverside FC - Men's - Primera", with the format ("11v11") on a muted
line underneath. A long league name must end in an ellipsis instead of
wrapping onto more lines or shrinking the type.
Existing surface this might already be: `Accordion` itself; this adds two
props. Composing the title from a `ReactNode` would let consumers restyle the
header, which the fixed `title: string` avoids.
Proposed API:

- `subtitle` (optional string): one muted caption line below the title. It is
  part of the header press target. The default header accessible name reads
  the subtitle after the title when the title is a separate action.
- `truncateTitle` (default `false`): keeps the title on one line and ends it
  with a tail ellipsis at its current type size. The full title remains the
  accessible name.
