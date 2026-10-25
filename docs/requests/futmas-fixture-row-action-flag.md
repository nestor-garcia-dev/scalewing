Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.55.0 (accepted 2026-10-25; FutMas F-010-S15 "Build, review and publish the schedule" gap 1: the review list's Move button and can't-play clash flag; standing owner approval).
Renderer: react
Missing surface: a trailing action and a named leading flag on a fixture row. An extension of `FixtureRow`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `FixtureRow` has `home`, `away`, `center`, `meta`, `status` and a whole-row `href`/`onPress`, but no control outside the row's press target (D2's "Move") and no leading marker with a spoken name (D2's "Can't-play clash"); the consumer cannot add either without its own CSS on Scalewing's grid.
Existing surface this might already be: `ListRow` has `action`, but not the fixture's centred two-sided layout or a named flag.
Workaround I almost used: `ui/GameRow.tsx`, a `ListRow` titled "{home} vs {away}" with the kickoff as its value and "Can't-play clash · " prefixed to the detail in warning ink.

## Accepted API (2026-10-25)

`FixtureRow` gains `flag?: FixtureFlag` (`{ label: string; tone?: 'warning' | 'danger' }`) and `action?: ReactNode`.

- `flag` is the row's first item: an `aria-hidden` round "!" mark in the tone's tint and ink (amber `warning` by default; `danger` red) with `label` as its `title` tooltip, and `label` read first from a hidden span; with `aria-label`, it is put before those words with ", ". From `md` it sits on the first line at the row's start (the home side kept clear); below `md` it leads the details' line. Forced colors draw it in CanvasText.
- `action` is a control after the row in the run's own last column, outside a link or button row's press area, after it in the Tab order, centred on the row and lined up down the run at every width; the hover fill spans the row and its action where `:has` is supported. Name it yourself ("Move Dorchester vs Milton").
- A blank flag label or an unknown tone throws a `RangeError`.

Evidence: `fixture-row.test.tsx` (flag order, mark, tooltip, aria-label prefix, action outside the row, statement row, empty slot, refusals); `fixture-css.test.ts`; `apps/gallery/e2e/fixture-row-action.spec.ts` (desktop, phone, forced colors, axe); gallery FixtureRow section "Monday 26 October · Reed bed".
