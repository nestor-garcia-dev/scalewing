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

`@scalewing/react@1.5.0` is versioned from merge `3c7d749` (PR #39) for
Teisoro D-9 (`teisoro-grid-column-span.md`, task 909): `Box` `columnSpan`
lets a direct child of a `Grid` cover several columns, capped at the grid's
count at each width, so the check-cashing form is twice the lookup panel on
desktop and stacks on a phone. Tag `react-v1.5.0`, validate, then publish
through Release packages; Teisoro pins 1.5.0 in task 909 once it is on npm.
Owner approved the release on 2026-09-24.

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
