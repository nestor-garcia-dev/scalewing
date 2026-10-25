Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.58.0 (accepted 2026-10-25; FutMas F-010-S19 "Roster requests and pasted players" gap 1, F-010-S20 "Team games, scores and scorers" gap 1, F-010-S21 "Can't-play times and team code" gap 1: the F1 Roster, F3b/F3c score sheet and F5 Team code boards; standing owner approval).
Renderer: react
Missing surface: a warning hint on a field that is not an error, a fixture group whose caption is not drawn, and monospace `Text`. Extensions of `Field`, `FixtureGroup` and `Text`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Field`'s `description` is always muted and `error` is red and invalid, so an amber "also wears 7" beside a shirt number must be a separate `Text` whose id the consumer threads into the input's `aria-describedby`; `FixtureGroup` always draws its required `title`, which repeats a sheet header that already names the game and day, and a `FixtureRow` must sit in a group's list; the mono face exists (`sw-font-mono`) but no `Text` prop exposes it, and a class name from outside breaks the consumer's Scalewing guard.
Existing surface this might already be: `Text color="warning"` beside the input (not linked to the control), a `FixtureGroup` titled with the venue so the caption adds a fact, `Text variant="headline"` in sans for the join code.
Workaround I almost used: `roster/NumberHint.tsx`, `team-games/SheetScore.tsx` and `join-code/BigCode.tsx` (the three fallbacks in the plans).

## Accepted API (2026-10-25)

- `Field` gains `descriptionTone?: 'muted' | 'warning'` (`FieldDescriptionTone`, `fieldDescriptionTones`; default `muted`). `warning` draws the description in `--sw-color-warning` after a private, `aria-hidden` alert glyph (space-4, centred on the first line); it stays in the control's `aria-describedby` and never sets `aria-invalid` or the danger border; `error` still replaces it. `CanvasText` in forced colors. Works at `size="xs"` in a `TableCell`. An unknown tone throws a `RangeError`. As proposed.
- `FixtureGroup` gains `titleHidden?: boolean` (default `false`): the title moves to a visually hidden element that still names the list through `aria-labelledby`, out of the layout. The title stays required and nonblank. As proposed.
- `Text` gains `font?: 'sans' | 'mono'` (`TextFont`, `textFonts`; default `sans`). `mono` adds the generated `sw-font-mono` class, which outranks the variant's sans family and keeps its size, weight, letter spacing and colour. The plan asked for tabular figures: the monospace face is fixed-width, so no `font-variant-numeric` is added. The face stays the generic `ui-monospace, monospace` (`css-font-mono.ts`); no new tokens value, as the platform chooses the face. An unknown font throws a `RangeError`.
