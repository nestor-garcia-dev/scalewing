---
'@scalewing/react': minor
---

`SegmentedControl` `fullWidthBelow` and an attached `ButtonGroup` `fullWidthBelow` (the layout `Breakpoint`, `md`): below it the control fills its column, its segments or buttons sharing the width equally; from it up nothing changes. `SegmentedControl` `size="sm"` (`SegmentedSize`, `segmentedSizes`; default `md`) pads each segment a step less and keeps its label on one line with an ellipsis past its share. Unknown values, and `fullWidthBelow` on a group that is not attached, throw a `RangeError`. New classes `sw-segmented-field-full-below-md`, `sw-segmented-sm` and `sw-button-group-full-below-md`; no new tokens or dependencies. Request: `docs/requests/teisoro-full-width-controls.md`.
