Status: in progress (react-native). Native-example demonstrates selected, unselected, and trailing.

Scalewing request from futmas.

Renderer: react-native
Missing surface: TabBar (bottom destination tabs plus an optional trailing control)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Those primitives can lay out presses, but a bottom tab list needs tab
semantics (tab / tablist, selected state), a shared selected accent, and a
trailing slot that is not a fourth equal tab. Button is a single press
action, not a tab. Web Nav is a label-size link cluster on DOM, not a native
bottom bar.
Existing surface this might already be: web Nav (DOM only). Button.
Workaround I almost used: four product Pressables with hex, a second nav kit,
or Expo default tabs with a custom tint.
Proposed API (reusable names only):
<TabBar
  items={[{ key, label, icon, selected, onPress }]}
  trailing={node}
  bottomInset={number}
/>
Icons are slots. Product copy and pictograms stay in the consumer. Do not
name the primitive MatchesBar or FotMobNav.
