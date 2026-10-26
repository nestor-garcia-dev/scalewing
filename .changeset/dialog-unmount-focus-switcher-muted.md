---
'@scalewing/react': patch
---

A `Dialog` unmounted while open (a consumer that renders it only while it is open) now closes first, while it is still in the document, so the browser hands focus back to the element that had it when the dialog opened, as a dialog closed by `open={false}` does; removed while open, a modal dialog left focus on the body (WCAG 2.4.3). `onClose` is not asked. A `ContextSwitcher` trigger's muted words read as the text colour while it is open or hovered, on its quiet fill (4.14:1 before), as rows already do. No API change.
