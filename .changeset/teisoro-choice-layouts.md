---
'@scalewing/react': minor
---

Four opt-in options for a form's choices and a setup checklist (Teisoro F-001, request `docs/requests/teisoro-choice-layouts.md`). Every default is unchanged.

- `Checkbox appearance="tile"` (`checkboxAppearances`): the box, label and description in a bordered tile as wide as its column, the whole tile one press target, with the accent edge while chosen and the danger edge while invalid. New classes `sw-checkbox-tile`, `sw-checkbox-tile-checked`, `sw-checkbox-tile-invalid`.
- `RadioGroup descriptionLayout="stacked"` (`radioGroupDescriptionLayouts`): every option's description on its own line under its label at every width. New class `sw-radio-group-stacked`.
- `Field variant="read-only"`: a value shown, not typed, on the subtle fill with no edge; needs one `readOnly` native input or textarea. New class `sw-field-read-only`.
- `TaskList numbered` and `actionBelow="md"`: open tasks show their place in their ring, and below md each action takes a full-width line under the words. New classes `sw-task-list-numbered`, `sw-task-list-action-below-md`.

No new tokens or dependencies.
