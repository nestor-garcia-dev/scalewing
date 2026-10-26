# Roadmap

## Current focus

Independent per-package releases (ADR 0009, `docs/requests/independent-package-releases.md`): approved by the product owner on 2026-09-21 and in implementation. The first release under it is 1.0.0 for all three packages, the start of stable versioning, released tokens first, then react, then react-native; it includes the web `Box` `hideBelow`/`hideFrom` props.

Native Accordion for FutMas: independent title navigation and disclosure,
controlled open state, theme-owned rounded grouping, accessible expanded
state, and metadata slot. Validate in the native example and linked FutMas.

FutMas native SegmentedControl contrast correction: selected accent/onAccent
fill and a 44-point minimum target, using existing tokens. Native tests pass;
linked iPhone visual review is next. See `docs/requests/futmas-segmented-control.md`.

Native `Field` shipped in the lockstep 0.5.0 release. The September 10 GitHub
release workflow completed successfully.

## Next action

Teisoro F-012-S03, release M1 "tables that hold a period"
(`@scalewing/react` 1.38.0), one PR each: `Table` `maxHeight`, rows that
scroll inside the table's own region with the header and a sticky total
pinned to it (`teisoro-table-contained-scroll.md`, #170); `TableRow`
`variant="total"` (`teisoro-table-row-total.md`, #171); `DataBar`
(`teisoro-data-bar.md`, #172); and `Pagination` (`teisoro-pagination.md`),
the last item (#173). Released in `@scalewing/react` 1.38.0. Next:
Teisoro pins 1.38.0 in its first consuming web story (S12, `ReportTable`
and `Statement`).

Teisoro F-012-S04, release M2 "charts" (`@scalewing/react` 1.39.0), one
PR each: `ChartLegend` (`teisoro-chart-legend.md`, #175); `ColumnChart`
(`teisoro-column-chart.md`, #176); `LineChart` (`teisoro-line-chart.md`,
#177); and `DataBar` `tone="danger"` for a shortage
(`teisoro-data-bar-short.md`, #178); with a pre-release fix to the charts'
hidden table (#179). Released in `@scalewing/react` 1.39.0. Next:
Teisoro pins 1.39.0 in its first story that draws a chart (S13,
`RunningTotalChart` and the Overview's Days bars); then release M3
(periods, lists and figures, F-012-S05).

Teisoro F-012-S05, release M3 "periods, lists and figures"
(`@scalewing/react` 1.40.0), one PR each: `DateRangeButton`
(`teisoro-date-range-button.md`, #181); web `ListGroup` / `ListRow`
(`teisoro-list-group.md`, #182); a count on a `Nav` word, `NavCount`
(`teisoro-nav-count.md`, #183); and `StatTile` `appearance="plain"`
(`teisoro-stat-tile-plain.md`, #184). Released in `@scalewing/react`
1.40.0. Next: Teisoro pins 1.40.0 in S12 (`PeriodControl`, `ReportAnswer`,
`LookList`).

Teisoro F-012-S23, release M4 "board fidelity" (`@scalewing/react`
1.41.0), one PR each, the shared foundations first: the grouped canvas,
`ThemeProvider canvas="grouped"` (`teisoro-canvas-grouped.md`, #186);
`Field` `width` (`teisoro-field-width.md`, #187); `DateField`
`entry="calendar"`, a day-picker field (`teisoro-date-field-calendar-entry.md`,
#188); `FilterChips` hidden label, inline counts, one scrolling row and
`multiple` (`teisoro-filter-chips-board.md`, #189); `ListRow`
`valueTone="warning"` and `valueBadge` (`teisoro-list-row-value.md`, #190);
`BarChart` `tone="neutral"` and `appearance="bare"`
(`teisoro-bar-chart-bare.md`, #191); `DenominationGrid`
`negativeAppearance`, `transposeBelow` and `countDigits`
(`teisoro-denomination-grid-board.md`, #192); `fullWidthBelow` on
`SegmentedControl` and an attached `ButtonGroup`, and `SegmentedControl`
`size="sm"` (`teisoro-full-width-controls.md`, #193); `Switch`
`layout="trailing"` and `checkedTone="success"`
(`teisoro-switch-trailing.md`, #194); `Dialog` `status`,
`canvas="grouped"` and `sheetGrabber`, and an `ActionBar` summary with no
figure yet (`teisoro-dialog-board.md`, #195). Released in
`@scalewing/react` 1.41.0. Next: Teisoro adopts 1.41.0 in its own task
(2410); its pin stays until then.

Teisoro F-014-S03, release T1 "training library" (`@scalewing/react`
1.42.0), one PR each: `NavCount` `tone="accent"`, a blue count for news
(`teisoro-nav-count-tone.md`, #198); then `ListRow` `unread`, `tag` and
`action` (`teisoro-list-row-trailing.md`, #199), `FileField`
(`teisoro-file-field.md`, #200), `DocumentViewer` (`teisoro-document-viewer.md`, #201),
`Article` (`teisoro-article.md`, #202) and `MarkdownView`
(`teisoro-markdown-view.md`, #203). `Steps open` already draws the success
line under a done step, so it needed no change. Released in
`@scalewing/react` 1.42.0. Next: Teisoro pins 1.42.0 in F-014-S04; its pin
stays at 1.41.0 until then.

Teisoro F-014-S07, release T2 "training fidelity", one PR each: `ListRow`
`truncate`, a title and detail cut to one line each
(`teisoro-list-row-truncate.md`, #206); `DescriptionList`
`layout="spread"`, each detail at its row's end
(`teisoro-description-list-spread.md`, #207); `FilterChips` option
`tone="warning"` (`teisoro-filter-chip-tone.md`, #208); and
`FilterChipsRow`, chip groups that wrap or scroll sideways together
(`teisoro-filter-chips-row.md`, #209). Tagged as 1.43.0, which was never
published (its release validation's gallery test timed out, fixed in
#211), with the words box's rule scoped to truncated rows (#212). Teisoro
F-014-S05's fidelity check then asked for four more, one PR each:
`sw-font-mono`, the monospace face for a Markdown source
(`teisoro-font-mono.md`, #213); `ActionMenu` `triggerAppearance="icon"`
(`teisoro-action-menu-icon-trigger.md`, #214); `FileField`
`value.preview`, a photo's thumbnail (`teisoro-file-field-preview.md`,
#215); and `sw-container-reading`, a reading-width column
(`teisoro-container-reading.md`, #216). Released together in
`@scalewing/react` 1.44.0. Next: Teisoro pins 1.44.0 in its task 2630
(F-014-S07) and applies the new options in Training.

Teisoro F-014-S06, release T3 "training acceptance" (task 2628), one PR
each: `ListRow` `titleLang`, a title in another language than the page's
(`teisoro-list-row-title-lang.md`, #218); a folded `Step`'s status word
read without a stray space (`teisoro-steps-status-words.md`, #219); `Step`
`titleDetail`, muted words beside an open step's title
(`teisoro-step-title-detail.md`, #220); `Article` `contentLang`, the title
and body in another language than the page's
(`teisoro-article-content-lang.md`, #221). Released in `@scalewing/react`
1.45.0. Next: Teisoro pins 1.45.0 in its task 2628 (F-014-S06) and applies
the new options in Training.

Teisoro F-014-S06, release T4 "the last training gaps" (task 2632), the
four gaps its acceptance review deferred, one PR each: `Select`
`aria-labelledby`, a select named by the page's words, read once
(`teisoro-select-labelledby.md`, #224); `Button` `width="full"`, an Edit
filling the row beside a ••• menu (`teisoro-button-full-width.md`, #225);
`ListGroup` `variant="tiles"`, one list laid out as tiles
(`teisoro-list-group-tiles.md`, #226); `FileField` `compact` and
`onRemove`, a chosen photo on one row with its own Remove
(`teisoro-file-field-compact.md`, #227). Released in `@scalewing/react`
1.46.0. Next: Teisoro pins 1.46.0 in its task 2632 (F-014-S06) and applies
the new options in Training and its ChoiceTrack.

FutMas F-010, release W1 "admin web frame": `AppShell`, a workspace frame
with a pinned sidebar, an icon rail and a top bar with a menu drawer
(`futmas-app-shell.md`), and `NavCount` `tone="warning"` with an
`AppShell` item's `countTone`, an amber count for work that needs the
person (`futmas-nav-count-warning.md`), together in #229. Released in
`@scalewing/react` 1.47.0. Next: FutMas pins 1.47.0 in its F-010 admin
web frame; then `GlyphTile` initials for league and team crests (done in
W2, below).

FutMas F-010-S09, release W2 "the league frame", one PR each: `AppShell`
`pageBar` and the menu's count (`futmas-app-shell-page-bar.md`, #231);
`ContextSwitcher`, a button that switches the context in use
(`futmas-context-switcher.md`, #232); `CommandPalette` and
`CommandPaletteTrigger`, a ⌘K search (`futmas-command-palette.md`, #234);
`Skeleton`, placeholder bars while content loads (`futmas-skeleton.md`,
#236); `FixtureRow` and `FixtureGroup`, pairings with their centres lined
up (`futmas-fixture-row.md`, #241); `GlyphTile` holding up to three
letters for crests (`futmas-glyph-tile-three-letters.md`, #243). Box
`orderBelow` was dropped (FutMas no longer needs it). Released in
`@scalewing/react` 1.48.0 with Teisoro's S1, on `@scalewing/tokens` 1.6.0.
Next: FutMas pins react 1.48.0 and tokens 1.6.0 in F-010-S09; then the
`TableRow` rule for the playoff cut line when S17 needs it.

FutMas F-010, the first league setup, one PR each: `Stepper` `unit`, a
short muted word after the count read in its value text
(`futmas-stepper-unit.md`, #245); `EmptyState`, a centred dashed panel
where a list or a page has nothing yet (`futmas-empty-state.md`, #247).
Released in `@scalewing/react` 1.49.0 on `@scalewing/tokens` 1.7.0 (which
also ship Teisoro's type sizes, Grid `fit` and `Hero`, below). Next: FutMas pins react 1.49.0 and
tokens 1.7.0 in F-010.

Teisoro F-017-S02, release S1 "the public site's frame" (Teisoro task
2705), one PR each: tokens `inverse` and `onInverse`, a dark band's
colours (`teisoro-inverse-colors.md`, #233); the React `Band`, a
full-width page band with the dark inverse one (`teisoro-band.md`, #235);
`ButtonLink`, a link drawn as a Button (`teisoro-button-link.md`, #237);
`SiteFooter`, a public site's footer on the dark band
(`teisoro-site-footer.md`, #238); `SiteHeader`, a public site's header
with a menu that works with no script (`teisoro-site-header.md`).
Released in `@scalewing/tokens` 1.6.0 and `@scalewing/react` 1.48.0
(which also ships FutMas's W2 pieces, below). Next: Teisoro pins both in
task 2705.

Teisoro F-017-S03, release S2 "the public site's pages" (Teisoro task
2710), one PR each: typography `hero`, `headline` and `lead`
(`teisoro-showcase-type.md`, #246); Grid `fit`, columns fitted to the
grid's width (`teisoro-grid-fit.md`, #248); `Hero`, a public page's
opening (`teisoro-hero.md`, #250). These three released early in
`@scalewing/tokens` 1.7.0 and `@scalewing/react` 1.49.0 with FutMas's
setup pieces (above). Then `ScreenPreview`, a drawn stand-in for an
app's screen (`teisoro-screen-preview.md`, #251), and `ThemeProvider`
`frame="site"`, a short page's footer at the window's foot
(`teisoro-site-frame.md`, #252), released in `@scalewing/react` 1.50.0.
Next: Teisoro pins react 1.50.0 and tokens 1.7.0 in task 2710.

FutMas F-010-S19 fix: an xs `Field`'s own text input lost to the canvas's
`[data-theme]` typed-input rule (md height, inherited type); it now draws at
the xs size, and the 44 px target on a coarse pointer (#272), released in
`@scalewing/react` 1.59.1. Next: FutMas pins react 1.59.1 in F-010-S19.

FutMas F-010-S22, Spanish, keyboard and screen-reader audit: muted words
take the text colour on a pressable `FixtureRow`, `ListRow` or `TableRow`'s
quiet fill (gap 1, 4.14:1 before); `LiveRegion`, a status line that
announces reliably (gap 2); `AppShell` `skipLink` (gap 3); `Select`
`disabled` (gap 4) (`futmas-row-hover-live-region-skip-link.md`), in one PR (#270),
released in `@scalewing/react` 1.59.0. Next: FutMas pins react 1.59.0 in
F-010-S22. Follow-ups: `ScheduleGrid`'s own polite status could move onto
`LiveRegion`; toned words (success, danger, accent) on the quiet fill fall
under 4.5:1 in some palettes, a palette-wide question for tokens.

FutMas F-010-S22 audit fixes, second patch: a `Dialog` unmounted while
open closes first, so focus returns to its opener (FutMas renders most
dialogs only while open, and focus fell to the body), and a
`ContextSwitcher` trigger's muted words read as text on its open or hovered
quiet fill (4.14:1 before), for the next `@scalewing/react` patch. Next:
release it, then FutMas pins it in F-010-S22.

FutMas F-010-S22 audit fixes: `GlyphTile` letters were text on a fill
that keeps white at only 3:1 (neutral crests 3.26:1, axe serious on every
FutMas page); a tile holding letters now mixes its fill 25 % toward black
(5:1 or more on every fill), and `Stepper`'s − and + are the 44 px touch
target both ways on a coarse pointer (32 px wide before), released in
`@scalewing/react` 1.59.2 (#274). Next: FutMas pins react 1.59.2 in
F-010-S22. Follow-ups from the same audit (not built): a visually hidden
text primitive (`Text visuallyHidden`) for spoken alternatives such as a
result letter's "Won 3–1", and a 44 px hit area for text links (`Box
as="a"`) on a coarse pointer.

FutMas F-010-S19, S20 and S21, roster, team games and team code: `Field`
`descriptionTone="warning"`, an amber hint that is not an error;
`FixtureGroup` `titleHidden`, a list name without a drawn caption; `Text`
`font="mono"`, the monospace face for a join code
(`futmas-field-tone-fixture-title-text-font.md`), in one PR (#268),
released in `@scalewing/react` 1.58.0. Next: FutMas pins react 1.58.0 in F-010-S19.

FutMas F-010-S17, inbox, scores, score sheet and standings: `FixtureRow`
`score`, two score boxes typed by keyboard in place of the centre, and
`detail`, a part under the row for a reason field; `TableRow`
`rule="after"`, the cut under the last playoff place
(`futmas-fixture-row-score.md`), in one PR (#266), released in
`@scalewing/react` 1.57.0. Next:
FutMas pins react 1.57.0 in F-010-S17.

FutMas F-010-S16, postpone, new times and republish: `FixtureRow`
`select`, a leading checkbox for the match day's games
(`futmas-fixture-row-select.md`), with the 1.55.0 review's follow-ups:
`ScheduleGrid` pick-up words by input, carries cancelled when focus
leaves and a fast drag release; the `FixtureRow` flag inline on a phone
row with no details' line; `DateToggleCalendar` `onChange` keeping only
days that can be toggled, in one PR (#264),
released in `@scalewing/react` 1.56.0. Next: FutMas
pins react 1.56.0 in F-010-S16.

FutMas F-010-S15, build, review and publish the schedule: `FixtureRow`
`flag` and `action`, a named clash mark and a Move button
(`futmas-fixture-row-action-flag.md`), `ScheduleGrid`, games by time and
field moved by drag, taps or keys with drop-to-swap and consumer drop
rules (`futmas-schedule-grid.md`), and `DateToggleCalendar`, days off on
month grids (`futmas-date-toggle-calendar.md`), in one PR (#262),
released in `@scalewing/react` 1.55.0. Next: FutMas pins react 1.55.0 in F-010-S15.

FutMas F-010-S14, venues and season rules: `Box as="a" external` with
`newTabLabel`, a link that opens a new tab with an arrow and hidden words
(`futmas-external-link.md`), and `Stepper onCommit` with `commitDelay`,
one save per finished entry (`futmas-stepper-commit.md`), in one PR (#260),
released in `@scalewing/react` 1.54.0. Next: FutMas pins react 1.54.0 in F-010-S14.

FutMas F-010-S13, teams and pasted teams: a table select column
(`Checkbox labelVisuallyHidden` and `indeterminate`, `TableSelectCell`;
`futmas-table-row-selection.md`), `Dialog placement="end"`
(`futmas-dialog-side-panel.md`), `PasteRows` (`futmas-paste-rows.md`) and
every `Select` size the 44 px target on a coarse pointer
(`futmas-select-touch-target.md`), in one PR (#258), released in
`@scalewing/react` 1.53.0. Next: FutMas pins react 1.53.0 in F-010-S13.

FutMas F-010-S12, seasons and league settings: `TaskList`, a setup
checklist with done, next, todo and waiting tasks (`futmas-task-list.md`),
and every `Button` size the 44 px target on a coarse pointer
(`futmas-button-touch-target.md`), in one PR (#254), released in
`@scalewing/react` 1.51.0 on `@scalewing/tokens` 1.7.0. Next: FutMas pins
react 1.51.0 in F-010-S12.

Teisoro F-017 acceptance (task 2725), site chrome follow-ups from the
marketing site's UX review, in one PR: `SiteHeader` `skipLink`, the
document's scroll padding clearing a sticky `SiteHeader`, the compact
actions hidden while the menu is open, and `SiteFooter` bottom-row links
at the touch target on a coarse pointer
(`teisoro-site-chrome-follow-ups.md`, #256), released in
`@scalewing/react` 1.52.0. Next: Teisoro pins react 1.52.0 in task 2725.

Teisoro F-011-S02, release R1 "guided-form core": web `Stepper`
(#113), `DenominationGrid` entry rows (#114), `Steps` / `Step` (#115)
and `ActionBar` `summary` (#116), released in `@scalewing/react` 1.27.0.
Next: Teisoro pins 1.27.0 and builds its `GuidedForm` and `BillCount`
composites on them.

Teisoro F-011-S03, release R2 "feedback": `Notice` (#118), `Notice`
`variant="band"` for the environment strip (#120), `Toast` title, action,
remaining time and top-end card (#119), `Progress` warning (#121),
`Dialog` header and pinned footer (#122) and `DenominationGrid`
`labelAppearance` (#124), released in `@scalewing/react` 1.28.0.

Teisoro F-011-S04, release R3 "identity": `@scalewing/tokens` categorical
colours (#126, released in tokens 1.5.0), then `GlyphTile` (#128), a web
`MultiSelect` (#129) and `SegmentedControl` item icons (#130), released in
`@scalewing/react` 1.29.0.

Teisoro F-011-S05, release R4 "ledger and navigation": `Table` ledger
extensions (#132), `TableFooter` with a sticky total (#133), `SectionNav`
counts and the filled appearance (#134), `ActionMenuItem` `detail` (#135),
`ButtonGroup` `attached` (#136) and `FilterChips` validation (#137),
released in `@scalewing/react` 1.30.0.

Teisoro F-011-S06, release R5 "search": `Field` `variant="search"` (#139)
and a web `Combobox` (#140), released in `@scalewing/react` 1.31.0.

Teisoro F-011, release R6 "canvas fidelity", every option opt-in:
`DenominationGrid` `frame="table"`, `totalEmphasis`, `cellToneAppearance`
and a blank `zeroLabel`, with `Stepper` `limitAppearance` (#142);
`Dialog` `appearance="banded"` (#143); `Button` `variant="neutral"` and
`disabledAppearance` (#144); `requiredMark="hidden"` (#145);
`SegmentedControl` `variant="raised"` (#146); and for the S17 shell `Nav`
`appearance="words"` (#147), `ActionMenu` `triggerAppearance="text"`
(#148), `ButtonGroup` `appearance="track"` (#149), and `AppHeader`
`appearance="bar"` with `Box` `border="bottom"` (#150). Released in
`@scalewing/react` 1.32.0. Out of R6: the canvas background, page width
and sizes carried by a product theme need a non-colour theme concept
(ThemeProvider carries colours only); a date heading as the calendar
trigger was dropped (a date's text is never the trigger).

Teisoro F-011 task 2145, two fixes for the cash ledger and the cash
check: scroll regions contain absolutely placed content (#152, patch)
and `Box` `link="quiet"`, a row title's link in the text colour set
apart by weight (`teisoro-box-link-quiet.md`, #153). Released in
`@scalewing/react` 1.33.0. Next: Teisoro pins 1.33.0 and sets quiet
titles on its `CashLedger`.

Teisoro F-011 task 2185, the owner's "make the entire row clickable"
for the counter's search results: `TableRow` `pressable` and `TableCell`
`onPress` (`teisoro-table-row-press.md`), a whole-row press for a row's
one action with the action drawn as the cell's text (#157). Released in
`@scalewing/react` 1.34.0. Next: Teisoro pins it on `CustomerSearch`,
`WhoOwes` and the NSF list.

Teisoro F-011 task 2180, the owner's "this last bottom row doesnt need
to be sticky" on the cash ledger: `Table` `stickyHeader="page"`
(`teisoro-table-sticky-page.md`), the header pinned to the page without
a sticky footer (#159). Released in `@scalewing/react` 1.35.0. Next:
Teisoro pins it on `CashLedger` and drops its footer's `sticky`.

Teisoro F-011 task 2200, the cash ledger's drawer row (a second row in
its `TableHeader`) half pinned: only its `th` stayed in view. A sticky
header now pins the whole `thead` as one group, every row and cell, with
each pinned cell's row rule on its own `::before` (#161). Released in
`@scalewing/react` 1.35.1. Next: Teisoro pins it on `CashLedger`.

Teisoro F-011 task 2205, the owner's Safari report: Tab from the cash
check's amount left the page instead of reaching its ✓ button. Every press
control and link now renders an explicit `tabindex="0"` (Safari skips a
button, link, checkbox or radio without one); a `RadioGroup` or
`FilterChips` gives it to its checked radio, else its first enabled one;
the gallery's `safari` Playwright project (WebKit, after `pnpm exec
playwright install webkit`; not in CI) holds the order (#163). Released in `@scalewing/react` 1.36.0 (with
Teisoro task 2210's two surfaces). Next: release the task's
`DenominationGrid` change and Teisoro pins it.

Teisoro F-011 task 2210, the owner's "every step open" for short guided
forms: `Steps` `open` (`teisoro-steps-open.md`), every step shown at once
as a region named by its title, only the markers following each status
(#164). Released in `@scalewing/react` 1.36.0. Next: Teisoro builds
`GuidedForm mode="open"` on it.

Teisoro F-011 task 2210, the owner's off-but-pressable submit for
"every step open" forms: a `Button` with `aria-disabled="true"` looks
disabled yet stays focusable and pressable
(`teisoro-button-aria-disabled.md`, #165). Released in
`@scalewing/react` 1.36.0. Next: Teisoro's open guided forms use it.

Teisoro F-011 task 2205, the owner's "show each column's value under its
count" for every bill count, then as its own row: `DenominationGrid` row
`valueRow` (`teisoro-denomination-value-row.md`), a value line under a
strip row with the total on it, each typed count described by its value
(`Stepper` `aria-describedby`) (#167). Released in `@scalewing/react`
1.37.0. Next: Teisoro pins 1.37.0 and turns it on in `BillCount`.

FutMas score entry (canvas board W3): `StepperRow`
(`futmas-stepper-row.md`) and `Field` `variant="search"`
(`futmas-search-field.md`), so a goal-scorer sheet lists a roster as
counted rows under a search box. Next: review and merge, release
`@scalewing/react-native` (minor), and FutMas pins it.

fantasy-football companion redesign (section tabs, a long trade builder
with a verdict in its ActionBar, phone review dialogs): additive
`@scalewing/react` surfaces, one per commit on
`claude/trade-desk-surfaces`:

- `Tabs` `sticky`: the section strip stays at the top of the viewport
  over a long panel, a band of the canvas (new
  `fantasy-football-tabs-sticky.md`).
- `ActionBar` `status` takes a node: a `Badge` and a short line on one
  wrapping row in a `div` live region (new
  `fantasy-football-action-bar-status.md`).
- `Dialog` `sheetBelow` and `closeLabel`: a bottom sheet below `md` and
  an icon-only close button ending the title row (new
  `fantasy-football-dialog-sheet.md`).

Next: open the pull request, get the Bar Raiser review and the owner's
review, merge, then release `@scalewing/react` (minor) and bump the
companion's pin from 1.17.0 after a linked check at 390 px.

Teisoro workspace navigation: `Tooltip` `disabled` shipped in
`@scalewing/react` 1.19.0. Follow-up: `Tooltip` `relationship="label"`
(new `teisoro-tooltip-labels.md`), so an icon-only destination is named
by its tooltip and read once, instead of "Vault, button, Vault". Branch
`claude/tooltip-labels`. Next: open the pull request, get the Bar
Raiser review and the owner's review, merge, release `@scalewing/react`
(minor), and Teisoro drops the destination's `aria-label` and pins it
after its `disabled` pin (Teisoro PR #43) merges.

Teisoro store-day calendars: `DateField` and `CalendarButton` `today`
(new `teisoro-calendar-today.md`), so a calendar rings and picks the
store's day instead of the device's. Branch `feat/react-calendar-today`.
Next: review and merge, release `@scalewing/react` (minor), and Teisoro
passes its store day wherever a calendar's `max` is that day.

Teisoro F-006-S11 task 1875: the Scalewing parts Teisoro's F-007 reviews
left open, one surface per commit on `claude/teisoro-f006-s11-parts`:
`Tabs` overflow shade (RPT-11), `TableCell` `sort` (RPT-13), `Table`
`layout`/`verticalAlign` and `TableCell` `width` (CHG-15, HIS-12),
`BarChart` `formatValue` and `diverging` (RPT-14), `CalendarButton`
`range` (RPT-17), `ActionMenu` `header` and `ActionMenuItem` `lang`
(SET-2, SET-14), `Tooltip` on a visible focus and inside the screen
(SET-9), `Field` `changed` (COR-5), `DenominationGrid` `labelWidth` and a
visible `totalLabel` (DRW-27, VLT-14, HIS-11), and the new `SectionNav`
(ADM-1). Merged in #101 and released in `@scalewing/react` 1.22.0;
Teisoro pinned it (task 1880). Second part, task 1885 (UX-16 and SET-3),
on `claude/teisoro-f006-s11-lg-breakpoint`: `hideBelow`/`hideFrom` `lg`
(64rem), `breakpointQuery` exported, and 44 px `Nav` buttons on a coarse
pointer, after Teisoro's design pass for the header was approved. Merged
in #103 and released in `@scalewing/react` 1.23.0. Next: Teisoro pins it
and changes its header. Third part, task 1890 (the storyboard
re-review), on `teisoro/f006-s11-review-findings`: `Field` `changed`
tints the fill with 12 % of the accent so a changed field reads apart from
the focused one (`teisoro-field-validation.md` follow-up), and a
`BarChart` item's `tone` colors its bar by meaning, such as a diverging
overage in warning and a shortage in danger (`teisoro-bar-chart.md`
follow-up). Next: review and merge, release `@scalewing/react` (minor),
and Teisoro pins it.

Teisoro F-006-S11, PR #65 review (blocking): `InfoTip`, a toggletip, so
an ⓘ beside a figure opens its tip on a tap, which a `Tooltip` on a
`Button` never does since 1.22.0 (`teisoro-tooltip.md`, 2026-10-09
follow-up). Branch `teisoro/f006-s11-info-tip`. Next: the coordinator's
independent review, merge, release `@scalewing/react` (minor), and
Teisoro replaces its no-op `Button` trigger with `InfoTip`.

Teisoro F-006-S03 task 1900 (the owner's At a glance, 2026-10-10):
`DescriptionList` and `DescriptionItem`, terms paired with what each
says in two columns that stack below `md`, with a hairline between rows
(`teisoro-description-list.md`). Branch `teisoro/f006-description-list`.
Reviewed and merged in #109; released in `@scalewing/react` 1.26.0.
Next: Teisoro pins it for the review day page's At a glance.

Teisoro F-007 task 1550: the design-system findings of the Vault UX
review (the `vault-*.md` reports), one surface per commit:

- `DenominationGrid` writes a negative count with the typographic
  minus (AUD-18, `teisoro-denomination-grid.md` follow-up).
- `Dialog` `titleLevel`: the title can be an `h2`, so a dialog's
  sections are `h3` (CHG-13, new `teisoro-dialog-title-level.md`).
- `DenominationGrid` `rowRole="group"`: a tiles row named without a
  landmark (CHG-4, `teisoro-denomination-grid.md` follow-up; the
  default stays `region` until a major release).
- `DenominationGrid` row `cellTones`: one tile toned in place (MOV-10,
  `teisoro-denomination-grid.md` follow-up, the 2026-09-25 "tone per
  tile" request without its `note`).
- A wide `Table` shades the edge with more columns past it (VLT-1,
  HIS-3, `teisoro-table.md` follow-up).

Merged in #89 and released as `@scalewing/react` 1.17.0. Next: Teisoro
pins 1.17.0 and adopts the new props.

FutMas F-019-S05: `ListGroup` `variant="plain"` and `Accordion` `flush`
(`futmas-plain-list-group.md`, 2026-10-02), so choices inside an open
picker are rows, not a card in a card. Merged in #87 and released as
`@scalewing/react-native` 1.14.0. Next: FutMas pins it.

Teisoro F-007-S05 task 1375 leftovers (the "Final check (2026-09-29 …)"
sections of `services-*.md`), one surface per commit, merged in #83
after three review rounds and released as `@scalewing/react` 1.16.0
(`DenominationGrid` `labelWidth`, DRW-27, was withdrawn):

- `Toast` keeps the page gutter on a phone (DRW-29, `teisoro-toast.md`
  follow-up).
- `Button` sets a glyph one token gap from its label (`services-nsf.md`
  final check, `teisoro-button.md` follow-up).
- A programmatic focus target (`tabindex="-1"`) takes the canvas's
  accent ring (NSF-34, ENT-29, DRW-30, new `teisoro-focus-target.md`).
- `DenominationGrid` keeps a row's glyph beside its label on a phone
  (DRW-28, `teisoro-denomination-grid.md` follow-up).
- `Field` `invalid`: the invalid state without a message of its own
  (DRW-18, `teisoro-field-validation.md` follow-up).

Next: Teisoro pins 1.16.0.

FutMas F-019-S06: `FloatingAction` (`futmas-floating-action.md`,
2026-09-30), so a form's one action floats as a capsule above the keyboard
under FutMas's form rule. Merged in #85 and released as
`@scalewing/react-native` 1.13.0. Next: FutMas pins it.

FutMas F-019-S04: `ListRow` `tone="danger"`
(`futmas-list-row-danger-tone.md`, 2026-09-29), so Sign out is a red row
as in iOS Settings under FutMas's one-button rule. Merged in #81 and
released as `@scalewing/react-native` 1.12.0. Next: FutMas pins it.

Teisoro F-007-S05 task 1365: a `RadioGroup` option `description`
(`teisoro-radio-group.md`, 2026-09-29 follow-up), so each company's
history sits on its own option's row in check cashing. Merged in #79
with the code-review fixes (a taller description, `0`, sample copy) and
released as `@scalewing/react` 1.15.0. Next: Teisoro pins it.

Teisoro F-007-S05 task 1355: `Select` `width="full"` (`teisoro-select.md`,
2026-09-29 follow-up), so a filter fills a phone row beside full-width
cards. Merged in #77 with the code-review fixes (an Inline row, long
words) and released as `@scalewing/react` 1.14.0; Teisoro pinned it.

Teisoro Services re-review fixes (F-007-S05 task 1350, the re-review
sections of `services-*.md`), merged in #75 and released as
`@scalewing/react` 1.13.0: a
disabled text control that looks locked (DRW-17,
`teisoro-field-disabled.md`); `SegmentedControl` `error` and `required`
(DRW-20, `teisoro-segmented-control.md` follow-up); a lone
`DenominationGrid` tiles row named once, by the grid (SDAY-31,
`teisoro-denomination-grid.md` follow-up); a `TableRow selected` bar that
moves no column (NSF-12, `teisoro-table.md` follow-up); a
`DateField` label row that matches `Field`'s (NSF-35,
`teisoro-date-field.md` follow-up); and a `RadioGroup` option `icon`
(CHK-13, `teisoro-radio-group.md` follow-up). Found while verifying:
a pressed toggle `Button`'s label readable in forced colors, a 1.12.0
regression (`teisoro-button.md` follow-up); and the `Select` label row
matching `Field`'s (`teisoro-select.md` follow-up). The code-review fixes
are in (the selected row keeps only its bar, no tint; a muted placeholder).
Open for the owner: documenting browser targets (`:has()` already ships in
Checkbox, FilterChips, RadioGroup and Switch). Next: Teisoro pins 1.13.0.

Teisoro Services UX fixes (F-007-S05 task 1335, UX reviews
`services-*.md`), merged in #73 and released as `@scalewing/react` 1.12.0:
`DenominationGrid` strip totals read at every width with a named total
column (SDAY-6) and a lone tiles row's total (ENT-7), both
`teisoro-denomination-grid.md` follow-ups; toggle `Button`s without the
unpressed fade and with an accent ring when pressed, and a `Badge` on a
filled button on the surface, and a quiet `FilterChips` chip in the muted
color instead of faded (NSF-1, `teisoro-button.md`, `teisoro-badge.md`,
`teisoro-filter-chips.md`); `ActionMenu` `align="end"` (ENT-13,
`teisoro-action-menu.md` follow-up); `Field` errors described on the
control through a polite live region that always exists, never a separate alert (CHK-3, DRW-6,
`teisoro-field-validation.md` follow-up); the `DateField` required mark
(NSF-15, `teisoro-date-field.md` follow-up); the `Select` trigger
centred, with the Accordion chevron and a stable width (DRW-12,
`teisoro-select.md` follow-up) and its `placeholder`, `required` and
`error` (DRW-12, `teisoro-select.md` follow-up); and `Toast` `tone` and
`icon` (DRW-14, `teisoro-toast.md`). The code-review fixes are in (the
pressed ring outside the fill, polite error regions, badge text ink, 6 s
warning and danger toasts). Next: Teisoro pins 1.12.0 (F-007-S05 task
1340).

`ActionRow` for FutMas F-002-S25 (`futmas-action-row.md`, owner approved
2026-09-28) on the new `accentSubtle` tint (`futmas-accent-subtle.md`, ADR 0011) is merged and versioned: `@scalewing/tokens@1.4.0`, then
`@scalewing/react-native@1.11.0` and `@scalewing/react@1.11.0` through
Release packages; FutMas pins them for S25.

Teisoro closeout day fixes (F-007-S04 task 1305, UX review
`closeouts-closeout-day-and-prior-day.md`), each its own commit on
`claude/closeout-day-fixes`: `ActionMenu` placement with a gap and a screen
inset (DAY-8), `Text` without the browser's paragraph and heading margins
(DAY-10, `teisoro-text.md`), and a 44 px `ActionMenu` trigger and commands
on a coarse pointer (DAY-9, the Scalewing part); both `ActionMenu` changes
are follow-ups in `teisoro-action-menu.md`. Merged in #68 with the
code-review fixes and versioned as `@scalewing/react` 1.10.1 (all patches).
Next: Teisoro pins 1.10.1 (F-007-S04 task 1310).

`CalendarButton` for the Teisoro closeout day heading (F-007-S03 re-review,
`teisoro-calendar-button.md`): an icon-only Button beside the day heading
opens the DateField calendar, replacing the separate "Go to a day" field.
Merged in #65 and versioned as `@scalewing/react` 1.10.0; publish through
Release packages. Next: Teisoro pins 1.10.0 and adopts it (F-007-S03
task 1290).

`@scalewing/react` 1.9.0 for Teisoro F-007-S03 task 1280 (the first UX
review, closing a register): `DateField` draws its own calendar (#61,
`teisoro-date-field.md`), and `Field` `prefix`/`suffix`, the `Accordion`
`subtitle`, chevron and `size="sm"`, the new `ActionBar`, `Box
border="dashed"`, `Grid` `align` and `Progress` `showCount` (#62), each
reviewed, fixed after code review and merged. Next: tag `react-v1.9.0` on
the merged version commit, validate and publish through Release packages,
then Teisoro pins 1.9.0 and adopts it in task 1285.

Clear tap targets for FutMas F-018-S01 (`futmas-action-tiers.md`, owner
approved 2026-09-26, release included): semantic `secondary`, `tertiary`,
and `subtle` colours with the `signal` palette (#52), Button `tertiary`
and a filled `secondary` on both renderers (#53), outlined choice chips
(#54), a native `ListGroup`/`ListRow` (#55), and a `filled` Card on both
renderers (this change, `futmas-filled-card.md`). Next: one release of
`@scalewing/tokens`, `@scalewing/react`, and `@scalewing/react-native`
through Release packages, then FutMas pins the new versions.

A wide `DenominationGrid` strip scrolls inside its own container with pinned
row labels for Teisoro F-002-S24 and F-002-S26 (`teisoro-denomination-grid.md`
follow-up, this change): Table and the strip share generated scroll-region
rules. Next: independent review and merge, then release `@scalewing/react`
through Release packages; Teisoro verifies the vault period summary and the
drawer audit card with a local link first. Found on the way: the gallery's
`Split` demo widens the page at 390 px (the start pane plus handle is wider
than the section), a separate Split request. Fixed in `@scalewing/react`
1.33.1 (#155, Teisoro F-011 task 2155): the split leaves the next column its minimum
and the gallery no longer scrolls sideways at 390 px.

`SingleSelect` `variant="list"` for FutMas F-002-S40
(`futmas-new-season-steps.md`): the stepped new-season flow asks who plays,
the age group, the term, and the meetings as full-width radio rows, some with
a detail line ("Twice · Home and away"). List items of `MultiSelect` take the
same optional `detail`. Merge the PR, then version
`@scalewing/react-native@1.9.0` and publish through Release packages; FutMas
pins 1.9.0 once it is on npm. Owner approved the release on 2026-09-25.

Native `Calendar` and a `list` variant of `MultiSelect` for FutMas F-015-S10
(`futmas-schedule-steps.md`): a stepped schedule flow asks one question per
screen, so the start-date step shows the month grid inline and the days and
fields steps list their choices as full-width checkbox rows. Merge the PR,
then version `@scalewing/react-native@1.8.0` and publish through Release
packages; FutMas pins 1.8.0 once it is on npm. Owner approved the release on
2026-09-24.

`@scalewing/react@1.6.1` is a patch for Teisoro: `TableCell numeric` and
`align="end"` cells align to the end again. The base `.sw-table th, .sw-table td`
rule had outranked the alignment classes since the table styles were added; the
gallery now checks a numeric cell's computed `text-align`. Merge the PR, tag
`react-v1.6.1`, validate, then publish through Release packages; Teisoro pins
1.6.1 once it is on npm. Owner approved the release on 2026-09-25.
(`@scalewing/react@1.6.0`, `Dialog` close requests and `ActionMenu` focus, was
released on 2026-09-24.)

Native `Progress` for FutMas F-017-S18 (`futmas-native-progress.md`): the
web component's props on a filled pill track, one accessible progress bar.
Merge the PR, then version `@scalewing/react-native@1.7.0` and publish
through Release packages; FutMas pins 1.7.0 once it is on npm. Owner
approved the release on 2026-09-24.

`@scalewing/react@1.4.1` is versioned from merge `151ad7e` (PR #33) for
Teisoro F-002-S15 (`teisoro-popup-stacking.md`): a glass `Card` or
`Accordion` holding an open `Select`, `ActionMenu` or `Tooltip` lifts above
the surface below it, so a covered option can be clicked. Tag `react-v1.4.1`,
validate, then publish through Release packages; Teisoro pins 1.4.1 once it
is on npm. Owner approved the release on 2026-09-23.

`@scalewing/react-native@1.5.0` is versioned from merge `de7535f` (PRs #29,
#30, and #31) for FutMas: pickers close on a tapped row and one stays open at
a time (F-015-S11, `futmas-wheel-close.md`), native `Field` `rows` for a
multi-line field (F-017-S08, `futmas-field-multiline.md`), and `Stepper`
announcing its value as the number rather than a percentage (F-017-S09,
`futmas-stepper-value-text.md`). Tag `react-native-v1.5.0`, validate, then
publish through Release packages; FutMas pins 1.5.0 with tokens 1.2.0 once it
is on npm. Owner approved the release on 2026-09-23.

`@scalewing/react-native@1.4.0` is versioned from merge `bf8d571` (PRs #25
and #27): native `WheelField` (one snapping wheel over consumer items, for
the season year) and `Stepper` (a bounded number between round minus and
plus buttons, for table points) for FutMas F-017-S01 (requests
`futmas-wheel-field.md`, `futmas-stepper.md`), published from tag
`react-native-v1.4.0` on 2026-09-23; FutMas pins 1.4.0 with tokens 1.2.0.
PR #26 merged into its stacked base after #25 had landed, so #27 carried the
stepper to `main`.

`@scalewing/tokens@1.1.0` and `@scalewing/react@1.1.0` are published from tags
`tokens-v1.1.0` and `react-v1.1.0` (merge `0982e68` of PR #12): web `Grid`,
`FilterChipOption.count`, `DenominationGrid`, `Text` `align`, and compact
`display`/`heading` sizes below `md` (tokens `compactTypographyVariants`) for
Teisoro F-002-S21 task 800 and its 805 preview feedback (requests
`teisoro-grid.md`, `teisoro-filter-chips.md` follow-up,
`teisoro-denomination-grid.md`). Release packages runs on 2026-09-22: tokens
validate 35749425389, tokens publish 35749602816; react validate 35749427789
failed as designed before tokens was on npm and 35749801873 failed the same way
during registry propagation; react publish 35749934546. Teisoro pins both
1.1.0 packages in task 805. An editable `DenominationGrid` mode is expected
from Teisoro task 810's design pass; StatTile stays a later request.

`@scalewing/react-native@1.3.0` is versioned from merge `84f56d5` (PR #19):
`TimeField` discloses scrolling hour, minute, and period wheels for FutMas
F-015-S09 (request `futmas-time-field.md`, revision 2026-09-22). Tag
`react-native-v1.3.0`, validate, then publish through Release packages;
FutMas pins 1.3.0 once it is on npm.

`@scalewing/react-native@1.2.0` is published from tag `react-native-v1.2.0`
(merge `7bc3951`): native `SingleSelect` for FutMas F-015-S06 (request
`futmas-single-select.md`). Validation run
[35682873593](https://github.com/nestor-garcia-dev/scalewing/actions/runs/35682873593)
and publication run
[35682925841](https://github.com/nestor-garcia-dev/scalewing/actions/runs/35682925841)
passed. FutMas pins 1.2.0.

Previously, `@scalewing/react-native@1.1.0` was published from tag `react-native-v1.1.0`
(merge `a526d4f`): native `DateField`, `TimeField`, `MultiSelect`, and the
`Field` clipping fix for FutMas F-015-S04 (requests `futmas-date-field.md`,
`futmas-time-field.md`, `futmas-multi-select.md`). Validation run
[35677814720](https://github.com/nestor-garcia-dev/scalewing/actions/runs/35677814720)
and publication run
[35677895469](https://github.com/nestor-garcia-dev/scalewing/actions/runs/35677895469)
passed. Next native work waits on a filled request; FutMas F-015-S07 reuses
these inputs without a new surface.

Teisoro F-002-S05: ActionMenu task 500 is reviewed and committed as `fad8f45`.
Switch task 510 is reviewed and committed as `6dac120`. DateField task 520 is
reviewed and committed as `1d69e34`. Checkbox task 530 is reviewed and committed
as `9e47362`. RadioGroup task 540 is reviewed and committed as `b0ce196`.
Spinner task 550 is reviewed and committed as `39a85a4`. Progress task 560 is
reviewed and committed as `de943eb`. Tooltip task 570 is reviewed and committed as `b718519`; Separator task 580 is reviewed and committed as `944f7ef`; FilterChips task 590 is reviewed and committed as `630bed9`; Field validation task 600 is in progress. Publish the
coordinated primitive set only in task 610 after each surface passes consumer
verification.

Version 0.6.0 is published for all three packages from tag `v0.6.0` (commit
`7a7800d`). Independent review, full local checks (113 tests), packed-artifact
inspection, and GitHub validation/publication passed. Release runs:
[validation](https://github.com/nestor-garcia-dev/scalewing/actions/runs/34649301270)
and [publication](https://github.com/nestor-garcia-dev/scalewing/actions/runs/34649467077).

Finish FutMas's registry-pin integration and native visual acceptance. No new
public surface is authorized by this release.

`@scalewing/tokens@1.2.0` and `@scalewing/react@1.4.0` are published from tags
`tokens-v1.2.0` and `react-v1.4.0` (merge `ea6f4ed` of PR #23 on top of merge
`b07ce8b` of PR #22): the `warning` semantic colour
(`docs/requests/teisoro-warning-tone.md`, `Badge tone="warning"`,
`Text color="warning"`), `StatTile` (`docs/requests/teisoro-stat-tile.md`),
`Tabs` with `TabPanel` (`docs/requests/teisoro-tabs.md`) and a keyboard-reachable
`Table` scroll wrapper (found by the consumer's axe audit) for Teisoro
F-002-S21 task 820 (employees, reports, risk management, NSF detail and the
shell). Each commit passed an independent Bar Raiser review and a
packed-tarball verification against Teisoro. Release packages runs on
2026-09-22: tokens validate 35800259162 and publish 35800382950, react
validate 35800621124 and publish 35800724561. Teisoro pins both in task 820.

`@scalewing/react@1.3.0` is published from tag `react-v1.3.0` (merge
`f7ca688` of PR #18 on top of merge `47efdef` of PR #17): `SegmentedControl` `disabled` (follow-up in
`docs/requests/teisoro-segmented-control.md`, `onChange` optional while
disabled in `69fff20`) and `ButtonGroup` (`docs/requests/teisoro-button-group.md`)
for Teisoro F-002-S21 task 815 (service entry pages and the void dialog; the
drawer close dialogs adopt the action row too). Each surface passed an
independent Bar Raiser review and a packed-tarball verification against
Teisoro. Release packages runs on 2026-09-22: validate 35788031436, publish 35788177846. Teisoro pins 1.3.0 in task 815.

`@scalewing/react@1.2.0` is published from tag `react-v1.2.0` (merge
`181b8d7` of PR #15 on top of merge `cc7bb86` of PR #14): `Dialog` `size` (`docs/requests/teisoro-dialog-size.md`),
six `Grid` columns (follow-up in `docs/requests/teisoro-grid.md`) and
`SegmentedControl` `variant="filled"` (`docs/requests/teisoro-segmented-control.md`,
sized to its container in `09a5c59`) for Teisoro F-002-S21 task 810 (drawer
close and support dialogs, plus the workspace header language switch). Each
surface passed an independent Bar Raiser review and a packed-tarball
verification against Teisoro. Release packages runs on 2026-09-22: validate
35770958220, publish 35772153078. Teisoro pins 1.2.0 in task 810.

## Later

- GitHub Pages or a public URL for the gallery.
- Menu, AppShell, StatTile, other chart types when a filled request shows
  existing primitives cannot cover the use case.
- Native Select, Dialog, Split, or Toast if a product needs those on React Native.
- FutMas is upgrading to `@scalewing/react-native@0.6.0`; future unpublished primitives can be previewed through the Dragon Tails sibling checkout (`/Users/Neto/Projects/Dragon-Tails/scalewing`) using `pnpm scalewing:link`. Its current mobile palette is Ink; do not invent a second skin in the app.
- coach-platform token migration for generic primitives only.
- Point coach-platform agent files at `docs/CONSUMER_REQUESTS.md` when that app’s agent files exist. Do not keep a copy-paste request chat as the intake path.

## Inventory notes

- FutMas mobile: Expo 57, React 19.2, React Native 0.86. Admin web is planned Vite/React.
- coach-platform web: Astro 7 with React 19. Domain cards stay in that app.
- fantasy-football: web app at `/Users/Neto/Projects/Dragon-Tails/fantasy-football` using `@scalewing/react`.
