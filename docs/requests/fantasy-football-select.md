Scalewing request from fantasy-football.

Status: implemented in this checkout (gallery + changeset; not yet published).

Renderer: react
Missing surface: Select (listbox menu) component
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Field wraps a native `<select>`. The closed control can match the canvas;
the open list is the operating system menu and cannot be painted with glass,
type, or radius tokens. Button can toggle state, but the labeled value +
options pattern needs a listbox, keyboard highlight, and an absolutely
positioned menu. Layout primitives cannot do that without a second menu kit
or invented overlay CSS.
Existing surface this might already be: none. Field is the native OS picker.
SegmentedControl is an always-visible exclusive row, not a compact menu.
Dialog leaves the page on the top layer.
Workaround I almost used: restyle native option in app CSS; copy glass onto a
raw button menu; Tailwind/hex overlay.
Proposed API:
<Select label="Range" value={id} onChange={setId} options={[{ value, label }]} />
size xs and labelVisuallyHidden match Field toolbar chrome. Web only.
