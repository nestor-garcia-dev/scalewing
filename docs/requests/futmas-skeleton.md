Scalewing request from FutMas.

Status: accepted 2026-10-24 (FutMas F-010-S09 "desktop shell and league overview", release W2 "the league frame"; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing). To ship in `@scalewing/react` 1.48.0.
Renderer: react
Missing surface: `Skeleton`, grey placeholder bars where content is loading.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas owns no CSS, so it cannot draw grey bars, pulse them or still them under reduced motion; a `Box` has no fill other than the background or surface.
Existing surface this might already be: `Spinner` (an indeterminate ring; the F-010 review 2 asked for skeleton rows, never page spinners); `Progress` (a known amount done).
Workaround I almost used: S02's spinner line ("Loading…" beside a `Spinner`).
FutMas use: the league overview's cards and lists while their data loads (This week's fixtures, Needs you, standings), on every layout.

## Proposed API (from the brief)

```ts
type SkeletonProps = {
  label: string;
  lines?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'lines' | 'rows';
};
```

## Accepted API (2026-10-24)

The brief's API, with `lines?: number` checked at run time (a whole number from 1 to 6, 3 by default) rather than a literal union, as the repo's other counts are. Exports: `Skeleton`, `SkeletonProps`, `SkeletonVariant`, `skeletonVariants`.

- A `div` with `role="status"` (polite), named by `label` through `aria-labelledby` on its own visually hidden words, which are also what it announces, once, as it appears (one status per loading region is the guidance; removing it announces nothing, so "loaded" needs the consumer's own cue). The bars are `aria-hidden` `div`s (so the generated `:nth-of-type` widths count bars only).
- `variant="lines"` (default): `lines` bars in a column, a space-3 gap apart, each 0.8 of the body text size high, in the quiet fill (`quiet-fill.ts`) with the small radius, widths stepping 100 %, 92 %, 84 %, 96 %, 88 %, 80 % so the ends are ragged; the last of several is 60 %.
- `variant="rows"`: `lines` list rows, each a space-6 mark and a bar (60 %, 45 % on even rows), the md control height (44 px, also on a coarse pointer), hairlines between rows.
- The bars and marks pulse between full and 60 % opacity (twice the travel duration on the travel easing, as Spinner's ring, alternating); under `prefers-reduced-motion: reduce` they are still. Forced colours, which drop fills, draw each bar's and mark's edge in `GrayText` (and the row hairlines). It fills its column's width.

### Classes

`sw-skeleton`, `sw-skeleton-lines`, `sw-skeleton-rows`, `sw-skeleton-bar`, `sw-skeleton-row`, `sw-skeleton-mark`; the keyframes `sw-skeleton-pulse`.

### Refused with a `RangeError`

A blank `label`; `lines` that is not a whole number from 1 to 6; an unknown `variant`.

No new tokens, public breakpoints or dependencies.
