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

## Follow-up request (2026-10-08, Teisoro F-006-S11 task 1875): a strip that overflows shows it

Status: merged in #101 (2026-10-09) and released in `@scalewing/react` 1.22.0 for Teisoro F-006-S11 task 1875; Teisoro pins and adopts it in task 1880.
Source: Teisoro UX review `admin-reports.md`, finding RPT-11 (minor; the Scalewing part). At 390 px the Services reports' four tabs ("Variance audit", "Provider reconciliation", "Cash flow", "Shift audits") run past the screen's edge with nothing to say the strip scrolls: its scrollbar is hidden, and unlike a wide `Table` since 1.17.0 it draws no edge shade. Teisoro shows a full-width "Report" `Select` below `md` instead of the tabs until the strip says it goes on.

Teisoro need: the Services reports keep their tabs at every width, and a phone sees that more reports are past the edge.

Behavior (no API change): the tablist follows its own scroll metrics with the scroll region's `useScrollOverflow` and adds `sw-scroll-more-start` / `sw-scroll-more-end`; `scrollShadeRules('.sw-tabs')` (the scroll region's edge rules, now shared) draws the inset shade on that edge, mirrored right to left, the both-edges rule last. A strip that fits has no class and no shadow, so it renders as before; before mount and on the server it reports no overflow. Forced colors drop the shadow, as on a table (the strip's hidden scrollbar stays hidden; the focus moves the strip to the focused tab, and the arrow keys reach every tab). A sticky strip keeps its canvas band and takes the shade over it.

Default on, not opt-in, as the table's cue: no strip that scrolls should hide that it does.

Rejected alternatives:

- Showing the strip's scrollbar. It is hidden on purpose (a quiet strip), and overlay scrollbars cannot be forced on.
- Wrapping the tabs onto two rows. A tablist that wraps loses its underline line and its order reads in two directions.
- Wrapping the strip in a `ScrollRegion`. The tablist already scrolls itself and is the keyboard stop; a second focusable group around it would add a tab stop with nothing new to say.

Evidence: `tabs.test.tsx` ("Tabs overflow shade": no class when the labels fit; end, both, then start as the strip scrolls, sticky or not; the generated rules on `.sw-tabs`, mirrored, both last); `apps/gallery/e2e/tabs.spec.ts` "A Tabs strip whose labels overflow shades the edge with more tabs past it" on desktop-en, mobile-es and forced-colors at 390 px: the six habitats overflow with `sw-scroll-more-end` and an inset shadow (none in forced colors), scrolled to the end only `sw-scroll-more-start`, and at 1280 px no class and no shadow.
