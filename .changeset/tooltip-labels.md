---
'@scalewing/react': minor
---

`Tooltip` `relationship` (`docs/requests/teisoro-tooltip-labels.md`, Teisoro's workspace navigation). `relationship?: 'description' | 'label'`, default `'description'`, and the exported type `TooltipRelationship`. `'label'` makes the tooltip its trigger's accessible name: the trigger gets `aria-labelledby` with the tooltip's id (after its own, if any) instead of `aria-describedby`, so an icon-only control's name is read once rather than as both name and description. The tooltip stays in the page, hidden, so it names the trigger while not shown. With `disabled` there is no tooltip and no reference to it; the trigger then needs its own name (visible text or `aria-label`). Without `relationship` the markup and behavior are unchanged. No new classes, tokens or dependencies.
