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

## September 11: visible native segmented selection

Renderer: react-native. Existing surface: SegmentedControl.

The native light selected fill and track are both white, making selection
depend on label weight/color. FutMas needs a visible Table/Fixtures state.
This is a correction to the existing surface; no new public API is needed.

Approved mobile refresh dependency, September 11, 2026: keep the glass track,
use accent/onAccent for the selected segment, and use the medium control
minimum height for comfortable tapping. Test light/dark and named palettes.
Existing native-example SegmentedControl demonstrates both states.

Status: implemented; full `pnpm check` passes (106 tests including release
checks, builds, lint, and types). FutMas iOS export succeeds against the local
link. Await iPhone screenshots for native visual acceptance; no publish made.
