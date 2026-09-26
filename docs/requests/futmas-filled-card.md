Status: implemented for the tokens 1.3.0, react 1.7.0, and react-native
1.10.0 releases.

Scalewing request from FutMas.

Renderer: tokens `cardVariants`, then react-native and react (Card only)
Missing surface: a Card for plain information that cannot be mistaken for
something to press.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every Card
variant is a white surface with a hairline or a shadow, which is also how
FutMas rows and chips looked. A phone test on 2026-09-26 found information
boxes hard to tell apart from tappable rows. The owner chose a grey filled
surface with no border for information (FutMas canvas boards 17 and 19),
while rows that open a screen become `ListRow`s (`futmas-list-row.md`).
Existing surface this might already be: `Card` `outlined` and `elevated`;
`filled` is a fourth variant of the same component.
Workaround I almost used: `Box` with a FutMas background colour, which its
rules forbid.
Proposed API: `Card variant="filled"`, a `subtle` fill (added in
`futmas-action-tiers.md`) with no border, the same radius and padding
props. `cardVariants` is shared, so both renderers get it in one change to
keep their switches exhaustive.

Behavior and failure boundary: no press behaviour. Text on `subtle` keeps
`text` and `muted`. Scalewing owns the fill; FutMas owns which panels are
information.
