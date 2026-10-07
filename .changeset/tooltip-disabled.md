---
'@scalewing/react': minor
---

`Tooltip` `disabled` (`docs/requests/teisoro-tooltip-disabled.md`, Teisoro's workspace navigation). `disabled?: boolean` turns the tooltip off while its trigger stays mounted: the tooltip element is not rendered, the trigger keeps only its own `aria-describedby`, and Escape reaches the page. Focus and hover are still followed, so a trigger that still has them shows the tooltip as soon as it is enabled again. A product toggles it at a breakpoint instead of rendering the trigger with and without a `Tooltip`, which mounted a new trigger and lost its focus. Without `disabled` the markup and behavior are unchanged. No new classes, tokens or dependencies.
