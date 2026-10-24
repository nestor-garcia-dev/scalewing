Scalewing request from FutMas.

Status: accepted 2026-10-24 (FutMas F-010-S09 "desktop shell and league overview", release W2 "the league frame"; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing). To ship in `@scalewing/react` 1.48.0.
Renderer: react
Missing surface: `FixtureRow`, one pairing of two sides with the time or score between them, and `FixtureGroup`, the caption over a run of them (a date, a venue).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the home side ends at the centre and the away side starts from it, and the centres line up down a run whatever the names; `Grid` has only equal columns and no alignment by side, `ListRow` is title, detail and value and cannot centre a kickoff between two names. FutMas owns no CSS.
Existing surface this might already be: `ListRow` (title/detail/value; its rules for a whole-row link or button are reused); `Table` (columns, but a table of games is not a table of data, and its rows are not links).
Workaround I almost used: `ListRow` with the title "Home vs Away", the detail "8:00 · Field 1" and the status as its `tag`.
FutMas use: the league overview's "This week" (S09), then S15, S16, S17 and S20 (the schedule, scores, a team's games, the public schedule): runs by date and venue, kickoff times before a game and scores after, the field at the end (left out on a phone), "To confirm" and "Final" statuses, a row opening the game.

## Proposed API (from the brief)

```ts
type FixtureRowProps = {
  home: { name: string; mark?: ReactNode };
  away: { name: string; mark?: ReactNode };
  center: string;
  centerKind?: 'time' | 'score';
  meta?: ReactNode;
  metaHideBelow?: Breakpoint;
  status?: { label: string; tone: BadgeTone };
  href?: string;
  onPress?: () => void;
  'aria-label'?: string;
};
type FixtureGroupProps = { title: string; children: ReactNode };
```

## Accepted API (2026-10-24)

The brief's API, with these refinements:

- `metaHideBelow` takes the visibility breakpoints (`VisibilityBreakpoint`: `md` or `lg`), as `Box hideBelow` does, since the brief wants `lg` too; the layout `Breakpoint` is `md` only. It reuses the generated `sw-hide-below-*` classes.
- `href` and `onPress` together follow ListRow: the row is a link, and `onPress(event)` takes a plain press (main button, no modifier) for a client router; a modifier press keeps the browser's behaviour.
- A `FixtureRow` lives in a `FixtureGroup` (its `li` needs the list; a row outside one throws), as a `Step` lives in `Steps`.
- `aria-label` is for a link or button row only (a statement row has no name to give).

Exports: `FixtureGroup`, `FixtureGroupProps`, `FixtureRow`, `FixtureRowProps`, `FixtureSide`, `FixtureStatus`.

### Layout and semantics

- `FixtureGroup`: a muted caption (caption size, weight 600, sentence case) naming a `ul` (`role="list"` kept) by `aria-labelledby`. The list is one CSS grid of five columns: the home side (`minmax(0, 1fr)`), the centre (`auto`), the away side (`minmax(0, 1fr)`), the end (`auto`) and the chevron (`auto`); every item and its row are `subgrid`s of it, so the centres and ends line up down the run whatever the names. The space between columns is the centre's, the end's and the chevron's own margin (no `column-gap`), so empty tracks add no gap; the end is drawn only with meta or a status. Browsers without subgrid (Chrome before 117, Safari before 16, Firefox before 71) get an `@supports not` fallback: each row its own grid of the same columns, read in order, the centres unaligned. Rows are divided by the border hairline.
- `FixtureRow`: the home side's name (label size, weight 500, wrapping) ends at the centre with its `mark` (hidden from assistive technology) on the centre's side; the centre is tabular, `time` (default) a small subtle chip at caption size weight 600, `score` bold figures; the away side starts from the centre, mark first. The end holds `meta` (muted caption) and `status` (a small `Badge`). Mirrored in right-to-left (logical columns). The row is the md control height (44 px).
- Below `md`: four columns; the end moves to a second line under the sides, from the start, and the chevron spans both lines. `metaHideBelow` hides the meta below `md` or `lg`.
- With `href` the whole row is a link, with `onPress` alone a button; either adds the shared chevron at the end (mirrored), the quiet fill on hover, an inset accent focus ring and the explicit `tabIndex`; forced colours outline a hovered row in `Highlight`. The name is what the row shows in order (home, centre, away, meta, status, spaced as separate text nodes), or `aria-label` in the consumer's words ("Heron Marsh with Otter Pool, 8:00"), which FutMas uses to add its own joining words. Without either it is a statement row (a `div`).
- Forced colours: the time chip keeps a `CanvasText` edge, the chevron `CanvasText`.

### Classes

`sw-fixture-group`, `sw-fixture-group-title`, `sw-fixture-list`, `sw-fixture-item`, `sw-fixture-row`, `sw-fixture-row-pressable`, `sw-fixture-team`, `sw-fixture-team-home`, `sw-fixture-team-away`, `sw-fixture-name`, `sw-fixture-mark`, `sw-fixture-center`, `sw-fixture-center-time`, `sw-fixture-center-score`, `sw-fixture-end`, `sw-fixture-chevron`.

### Refused with a `RangeError`

A blank `FixtureGroup` title; a `FixtureRow` outside a `FixtureGroup`; a side without a name; a blank `center`; an unknown `centerKind` or `metaHideBelow`; a status with blank words or an unknown tone; a blank `href`; a blank `aria-label`, or one on a row with neither `href` nor `onPress`.

No new tokens, public breakpoints or dependencies.
