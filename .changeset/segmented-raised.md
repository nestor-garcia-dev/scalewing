---
'@scalewing/react': minor
---

`SegmentedControl` `variant="raised"` (`SegmentedControlVariant` gains `'raised'`): a grey track (the quiet muted fill, no border) as wide as its segments, every segment the md control height in label type with its words in the text color, the selected one the surface raised by the small elevation (`docs/requests/teisoro-segmented-control-raised.md`, Teisoro F-011 release R6). In the dark scheme the selected segment draws a muted hairline ring (a shadow does not show there). Item icons, `error` (its danger outline is restated after the raised rules) and `disabled` behave as on the other tracks; the compact icon track's rules exclude it (their specificity unchanged). The default `compact` and `filled` tracks are unchanged. New generated class `sw-segmented-raised`. No new tokens or dependencies.
