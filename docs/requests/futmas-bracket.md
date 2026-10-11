Status: implemented on `futmas/bracket` for the next `@scalewing/react-native` minor release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `Bracket`, a knockout bracket shown one round at a time,
and `BracketMatch`, its match card.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: a league
season's Playoffs tab (FutMas F-007 canvas, boards R1–R5) shows up to eight
teams over quarter-finals, semi-finals, and a final. A whole eight-team tree
squeezed into a 390-point phone leaves about 100 points per name, so names
truncate and scores crowd out. Sports apps (FotMob's Knockout tab, ESPN's
Bracket tab) show one round at a time instead: a row of round choices, the
chosen round's matches as full-width cards (a status such as FT, the place,
each side's seed, name and score, the winner bold with a marker and the
loser muted), and the next round peeking in at the end edge, joined by
bracket lines. That needs lines drawn between cards from the same layout,
a peek clipped at the edge, and a list fallback at accessibility text
sizes, none of which composes from the layout primitives without a
consumer re-deriving spacing, hairlines, and type.
Existing surface this might already be: `SegmentedControl` for the round
choice (it would stack a second pill track under the page's own sections)
and `Table` rows for matches (they cannot draw the joins). The round
choices reuse the private `Chip` that `SingleSelect` uses.
Workaround I almost used: absolute-positioned FutMas `View`s with
hand-computed offsets and borders.
Proposed API (reusable names only):

```tsx
<Bracket
  accessibilityLabel="Rounds"
  onChange={setRound}
  rounds={[
    {
      id: 'semis',
      label: 'Semi-finals',
      matches: [
        {
          id: 'sf1',
          accessibilityLabel: 'Heron 2, Otter 0, Heron goes through',
          status: 'FT',
          detail: 'North pond',
          home: { label: 'Heron', seed: '1', score: '2', outcome: 'winner' },
          away: { label: 'Otter', seed: '4', score: '0', outcome: 'loser' },
        },
      ],
    },
  ]}
  value={round}
/>
```

- `rounds`: each `{ id, label, matches }`, matches in bracket order (1 and
  2 feed the next round's first match).
- `value` and `onChange(roundId)`: controlled; the round choices are radio
  chips in a horizontal scroll named by `accessibilityLabel`.
- A match (`BracketMatchProps`): `accessibilityLabel` (the card's one
  accessible name), `status?`, `detail?`, `home`, `away`, `tentative?`
  (a dashed outline while the pairing can change), `onPress?`, `testID?`.
- A side (`BracketSide`): `label`, `seed?`, `score?`, `outcome?`:
  `winner` (label weight, a marker), `loser` (muted), `pending` (a muted
  caption placeholder such as "Winner of 1 v 8"), or `open` (default).
- The next round peeks in only when the chosen round has twice its
  matches; pressing it shows that round. The peek is hidden from assistive
  technology (the chips reach the same round). At a text scale of 1.35 or
  more, and before the first layout, the round is a plain list.
- `BracketMatch` is exported too, for a match shown beside the bracket
  (FutMas shows the third-place game under the final).

Visual: outlined cards on `surface` with the `border` hairline and the `md`
radius; the status in `data` type, the place in caption, names in body
(winner in label weight), seeds in muted caption, scores with tabular
digits; bracket lines in the `border` colour; the peek keeps
`space[4] + space[8]` at the end edge.
