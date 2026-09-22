Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 820; pending independent review and packed-consumer verification.
Renderer: react
Missing surface: `Tabs`, a tab strip with `tablist` semantics, and `TabPanel`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the frozen Angular Services reports page is four Material tabs (Variance audit, Intermex reconciliation, Cash flow, Shift audits) that scroll on a phone. React has used `SegmentedControl` for them since S06, which is a `radiogroup` for an exclusive choice, not a tab strip: it announces radios, has no `tabpanel` relationship, and its filled or chip track does not read as page sections. Scalewing's own `Nav` guidance says a segmented control is for exclusive choices.
Existing surface this might already be: `SegmentedControl` (exclusive choice, radio semantics); `Nav` (links between destinations, not panels on one page); `Accordion` (stacked disclosure, one open at a time, not a strip).
Workaround I almost used: keeping the segmented control with an `aria-label` that says "tabs".
Teisoro use: `docs/design/remaining-routes/04-services-reports.md`.
Proposed API: `Tabs` with `id: string` (prefix for the tab and panel ids), `items: readonly { id: string; label: ReactNode }[]`, `value: string`, `onChange(id)`, and an accessible name (`aria-label` or `aria-labelledby`); renders `role="tablist"` with one `role="tab"` button per item (`aria-selected`, `aria-controls`, roving `tabIndex`), ArrowLeft / ArrowRight / Home / End move and select, the strip scrolls horizontally when it overflows (generated `sw-tabs`, `sw-tab`, `sw-tab-selected` with an accent underline). `TabPanel` with `tabsId`, `id` and children renders `role="tabpanel"` with the matching `id` and `aria-labelledby`, `tabIndex={0}`, hidden when it is not the current tab (`hidden` attribute, so the consumer can keep every panel mounted or render only the current one).
Behavior and failure boundary: automatic activation on arrow keys (the report loads on selection, as Angular does); no lazy loading, no routing; the consumer owns the panel content and its loading state.

Scalewing owns the classes, tests, gallery evidence and changeset. Teisoro owns the tab labels and the panels.
