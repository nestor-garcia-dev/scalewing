Status: in progress (react-native). Native-example demonstrates Table /
Fixtures-style labels.

Scalewing request from futmas.

Renderer: react-native
Missing surface: SegmentedControl (two or more mutually exclusive sections)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Those primitives can lay out presses, but a section switch needs radiogroup
semantics, a shared selected surface, and the same pill track language as web
`SegmentedControl`. Button is a single action. Native TabBar is destination
navigation, not in-page sections.
Existing surface this might already be: web SegmentedControl (DOM only).
Button. TabBar.
Workaround I almost used: two product Buttons, hex pills, or Expo segment
kits.
Proposed API (reusable names only):
<SegmentedControl
accessibilityLabel={string}
items={[{ id, label }]}
onChange={(id) => void}
value={string}
/>
Labels are product copy. Do not name it TableFixturesControl or LeagueTabs.
