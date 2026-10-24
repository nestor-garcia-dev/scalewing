Scalewing request from FutMas.

Status: accepted 2026-10-24, for `@scalewing/react` 1.49.0 (FutMas F-010 "web administration foundation": the empty Teams page, C5EmptyTeams, and the empty Seasons list, C2Seasons; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing).
Renderer: react
Missing surface: `EmptyState`, a centred panel where a list or a page has nothing yet: a decorative glyph, a title, a muted line and the actions that fill it.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Box border="dashed"` draws the edge, but FutMas owns no CSS for the glyph's quiet square (the subtle fill in the muted colour, the glyph sized inside it), a readable measure for centred words, a wrapping centred actions row, or 44 px buttons on touch; composing it per page would drift between the Teams, Seasons, Venues and Admins pages.
Existing surface this might already be: `Notice` (a tinted note about the page, not the page's own empty content); `Skeleton` (loading, not empty); `Card` (a surface, no layout).
Workaround I almost used: the canvas's own `.fm-empty` rules, which FutMas cannot ship.
FutMas use: "No teams in Spring 2027 yet" with "Copy Fall 2026's 6 teams" and "Paste a list" on the Teams page; empty seasons, venues and admins lists, inside a page column or a card.

## Proposed API (from the brief)

```ts
type EmptyStateProps = {
  title: string;
  titleAs?: 'h2' | 'h3';
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
};
```

## Accepted API (2026-10-24)

The brief's API. Exports: `EmptyState`, `EmptyStateProps`, `EmptyStateTitleElement`, `emptyStateTitleElements`.

- A plain `div` (no role, not a landmark or live region) on the surface (`--sw-color-surface`) inside a 1 px dashed hairline (`--sw-color-border`) with the md radius, spacing step 8 above and below and step 4 at the sides, its parts a step 3 apart, centred, filling its column (`width: 100%`, `min-width: 0`), so it fits a page column or a Card. Long words break.
- `icon`: `aria-hidden` square of spacing step 8 on the subtle fill in the muted colour, the md radius; a direct-child SVG is drawn at step 5.
- `title`: a heading at `titleAs` (`h2` by default, `h3` in a card under its own heading) in title type; `description`: a muted body `p`. Both capped at the reading width (`--sw-reading-max`).
- `actions`: a centred row that wraps, a step 2 apart; a Button in it is at least 44 px high on a coarse pointer.
- RTL needs nothing (centred); no motion; forced colours keep the dashed edge in `CanvasText` and draw the glyph in `CanvasText`.
- An empty `icon` or `actions` (nothing, an empty Fragment or array, or blank words) draws no box.
- Inside a bordered Card (glass or `outlined`) the edges double; the README suggests the panel in place of the card, or an `elevated` or `filled` Card (Scalewing has no "plain" Card variant).
- No hooks or context, so no `'use client'`.

### Deviations from the canvas

The canvas's 64 px block padding, 56 px glyph square and 28 px glyph are drawn from the spacing scale as 48, 48 and 24 px (steps 8, 8 and 5); its 10 px gap is step 3 (12 px). No new tokens.

### Classes

`sw-empty-state`, `sw-empty-state-icon`, `sw-empty-state-title`, `sw-empty-state-description`, `sw-empty-state-actions`.

### Refused with a `RangeError`

A blank `title`; a blank `description` when given; an unknown `titleAs`.

No new tokens, public breakpoints or dependencies.
