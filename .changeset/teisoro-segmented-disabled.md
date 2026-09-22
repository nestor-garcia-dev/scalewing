---
'@scalewing/react': minor
---

Add `SegmentedControl` `disabled`: the group reports `aria-disabled`, every segment is a disabled button, arrow keys and clicks are ignored, and the track fades to `--sw-disabled-opacity` (generated `sw-segmented-disabled`). The recorded choice stays visible, for an identity that can no longer change; a disabled control may omit `onChange`.
