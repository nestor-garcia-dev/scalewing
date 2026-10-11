---
'@scalewing/react': minor
---

`ActionBar` `summary` (with `ActionBarSummary` and `ActionBarSummaryTone`): a labelled figure first in the bar's polite status region (`docs/requests/teisoro-action-bar-summary.md`, Teisoro F-011 release R1).

- `summary: { label, value, detail?, tone?: 'default' | 'danger' | 'success' }`: the label and detail in muted label-size words, the value in the `heading` variant at tabular figures, on one baseline; `tone` colors the value only. Any `status` follows it in the same live region.
- A blank `label`, `value` or `detail`, or an unknown `tone`, throws a `RangeError`.
- New generated classes `sw-action-bar-summary`, `sw-action-bar-summary-label`, `sw-action-bar-summary-value`, `sw-action-bar-summary-detail`, `sw-action-bar-summary-danger` and `sw-action-bar-summary-success`. No new tokens or dependencies.
