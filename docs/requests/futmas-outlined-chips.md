Status: in progress (react-native). MultiSelect and SingleSelect chips in
the native example show the new look.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: none new. The private chip behind the `chips` variant of
`MultiSelect` and `SingleSelect` changes its look.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: a selected chip
today is an accent-filled pill with the `onAccent` label, which is also how
a primary Button looks. A phone test on 2026-09-26 found the two hard to
tell apart ("a version of those are clickable in other places and they also
look like the buttons"). The owner chose outlined chips (FutMas canvas
boards 17 and 19) while every Button becomes a solid fill
(`futmas-action-tiers.md`).
Existing surface this might already be: this is that surface; no new
component or prop.
Workaround I almost used: a FutMas chip row built from `Pressable`, which
would fork the selection semantics MultiSelect and SingleSelect own.
Proposed look:

- Unselected: the hairline outline, no fill, the text colour label.
- Selected: an accent outline and accent label, led by a check. The outline
  keeps its width so selecting never shifts the row.
- Every chip keeps its 44-point target, role, and state.

Behavior and failure boundary: no API or behaviour change. The check is
decorative and hidden from assistive technology; the checked or selected
state already announces the choice. The web renderer has no chips.
Scalewing owns the chip look; FutMas owns the items and labels.
