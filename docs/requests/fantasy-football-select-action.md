Scalewing request from fantasy-football.

Status: implemented in this checkout (gallery + changeset; not yet published).

Renderer: react
Missing surface: `Select` `action` (prop on the existing primitive)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Select is a labeled value plus options. A create/add command belongs in that
open list as the last row, but it must not become the displayed value or
flow through `onChange`. Putting a sentinel id in `options` is a product
workaround. Button cannot live inside the listbox keyboard ring without
Select owning the extra row. Accordion and Dialog leave the compact menu.
Existing surface this might already be: Select options. Not Field (native
OS picker). Not Nav (always-visible links). Not Button beside the control.
Workaround I almost used: fake option value `__add__` in the product;
navbar Link beside Select; app CSS on the list.
Proposed API:
<Select
label="Range"
value={id}
onChange={setId}
options={[{ value, label }]}
action={{ label: 'Log a visit', onPress: () => undefined }}
/>
`action` is one trailing listbox option. Choosing it calls `onPress` and
closes. The trigger still shows `value`. Web only.
