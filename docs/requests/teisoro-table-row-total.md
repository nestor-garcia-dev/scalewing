Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.38.0 (PR #171; accepted 2026-10-13; Teisoro F-012-S03, release M1 "tables that hold a period", item 2; the manager views inventory's row 6; plan approval under Teisoro decisions O-1 and D-1).
Renderer: react
Missing surface: a bold total row mid-table, under the heavier rule, for a subtotal the rows above add up to before the table goes on (the statement's "Expected in the store"). An extension of `TableRow` `variant`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the statement boards (ReportsOverview "How the cash moved", Services, Vault, Bounced checks, a day, a bounced check) list where the cash started, what came in and went out, then a bold "Expected in the store" line under a heavier rule, then what was counted and what is off under it. `TableFooter` draws a total at weight 600 under a 2 px rule, but only as the table's last row group; `TableRow` has `default` and `sub` only, and Teisoro owns no CSS (no bold class, no rule).
Existing surface this might already be: `TableFooter` (the total at the end; the statement goes on after its subtotal); `TableRow variant="sub"` (a row under the one above, the opposite emphasis); `Text weight` in each cell (bold words without the rule, and every cell by hand).
Workaround I almost used: the subtotal split into its own table, or bold `Text` in each cell with no rule.
Teisoro use: `Statement` (grown from `ui/MathTable`): every statement's "Expected" subtotal.
Proposed API (inventory): `TableRow variant="total"`.

## Accepted API (2026-10-13)

- `TableRow` `variant` takes `'total'` beside `'default'` and `'sub'` (`tableRowVariants` is now `['default', 'sub', 'total']`; `TableRowVariant` widens). It adds the generated class `sw-table-row-total`; an unknown variant still throws a `RangeError`.
- Look: the row's cells at weight 600 under a 2 px rule in the border colour across its top, as a `TableFooter` total is drawn, so a subtotal and the closing total read as one family. The rule is the cells' own top border, which the collapsed-border model resolves over the row above's 1 px rule: forced colours keep it (`CanvasText`), it moves no column, and it takes no pseudo-element from a selected row's bar or a sub row's guide. The body row header reset (`th scope="row"`) is weaker, so the row's name is bold too.
- **No fill (a difference from the board).** The board draws the subtotal on a near-white fill (#fafafc). Scalewing's nearest is `subtle`, on which accent text (a link, an accent figure) falls under 4.5:1 in eight palettes (cornflower, soft-blue, capri, raspberry, amber, fuchsia and synthwave light, synthwave dark; measured with `forEveryTheme`), as the selected row found before. Weight and the 2 px rule carry the emphasis, and accent text keeps the contrast it has on the table's own surface.
- Keep it in the body, after the rows it adds up (not the body's first row under a pinned header, whose 1 px rule would sit on the total's 2 px one), and keep its name plain text: its cells are all at weight 600, so a quiet link or an `onPress` action in it is not set apart by weight (as in a `TableFooter`). A pinned header cell draws its rules on pseudo-elements and would leave a border behind, and the table's last total is a `TableFooter`. A cell `tone` keeps its colour; `struck` works on it as on any row.
- No new tokens, layers or dependencies.

Evidence: `table-total-row.test.tsx` (the known variants, the class on an ordinary body row named by its row header, tone and struck kept, the sub row unchanged, the catalog, the rule at 600 with no fill, forced colours); `table-ledger.test.tsx` (the variant list); gallery "Table" ("A total mid-table": a day's wader count with "Expected at dusk", its figure toned accent, between what came and went and the dusk count; the same table compact); `apps/gallery/e2e/table-total-row.spec.ts` on desktop-en, mobile-es and forced-colors.
