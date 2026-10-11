Scalewing request from Teisoro.

Status: accepted 2026-10-11 for the `@scalewing/react` 1.27.0 release (Teisoro F-011-S02, release R1 "guided-form core", item 4; the inventory's row 12).
Renderer: react
Missing surface: `ActionBar` `summary`: a labelled figure (label, a large value, a detail line) in the bar's status, with a tone for a short or a matched count. An extension of `ActionBar` (`teisoro-action-bar.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 canvas puts a bottom bar on 54 boards and 10 sheets: "Received **$500.00** Change $20.00", "Counted **$33,790.00** short $4,000.00" (the figure red), Cancel and one named primary. `ActionBar` `status` takes a node, but its status row is caption type, so a `Text variant="heading"` placed in it would be the consumer sizing a figure inside Scalewing's row, with the label, figure and detail on a baseline the consumer cannot set without CSS, and a tone mapping of its own.
Existing surface this might already be: `ActionBar` `status` (a short line, or a `Badge` and a line); `StatTile` (a figure in a tile, not in a bar).
Workaround I almost used: `status={<><Text>Counted</Text><Text variant="heading" color="danger">$33,790.00</Text>…</>}`, wrapping and aligning wrongly in the caption row.
Teisoro use: the `GuidedForm` composite's bar on every guided board (EntryStep1/2, StepCheck1a, PosClose1, OpenDay1, VaultCount1, CloseDay1, the drawer sheets). Design: `docs/design/redesign-2026-10/component-inventory.md` row 12.
Proposed API (inventory): `summary?: { label, value, detail?, tone?: 'default' | 'danger' | 'success' }`: the value at title size, tabular, inside the existing polite `status` live region. The primary uses `Button disabled`.

## Accepted API (2026-10-11)

- `ActionBarProps.summary?: ActionBarSummary`, where `ActionBarSummary = { label: string; value: string; detail?: string; tone?: ActionBarSummaryTone }` and `ActionBarSummaryTone = 'default' | 'danger' | 'success'`.
- It renders first in the bar's status region (`role="status"`, polite), before any `status`: the label and the detail in muted label-size text, the value between them in the `heading` variant (28, 24 below `md`; the board's 26 is between them, D-2 takes the nearer step, not the inventory's `title` 20) at tabular figures, all on one baseline, wrapping as one phrase. `tone="danger"` or `"success"` colors the value only; the words carry the meaning ("short $4,000.00").
- The value changes are announced politely, as any status; the consumer formats the money.
- The actions are the existing children: a secondary Cancel and one primary, which the consumer disables until the form is valid.
- Failure boundary: a blank `label` or `value`, a blank `detail`, or an unknown `tone` throws a `RangeError`.
- Generated classes `sw-action-bar-summary`, `sw-action-bar-summary-label`, `sw-action-bar-summary-value`, `sw-action-bar-summary-detail`, `sw-action-bar-summary-danger`, `sw-action-bar-summary-success`. No new tokens. The bar buttons stay the `md` control (44); the board's 56 is not on the scale (inventory risk 1).
