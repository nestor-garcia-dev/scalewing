Status: implemented on `futmas/bracket` for the next `@scalewing/react-native` minor release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `SegmentedControl` `scrollable`, a track that scrolls
sideways so every label keeps its width.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: a FutMas
season page's sections are Table, Fixtures, Playoffs, Stats, and Rules
when a season has both playoffs and goal stats. Five equal items on a
390-point phone leave each label about 46 points, so "Fixtures" breaks
mid-word, and Spanish "Estadísticas" is worse. Sports apps (FotMob's league
page) let that row scroll.
Existing surface this might already be: `SegmentedControl` itself; this is
a prop on it, not a parallel tab strip.
Workaround I almost used: wrapping the control in a FutMas `ScrollView`
with a fixed width per item.
Proposed API: `scrollable?: boolean` (default false). When true the glass
track is a horizontal `ScrollView`'s content: items keep their label's
width and grow to fill spare room, so a row that fits looks as before. The
scroll view carries the radiogroup role and name.
