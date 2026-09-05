---
'@scalewing/tokens': patch
---

Stops grouping native select into `:is(input[type=text], select)`, which made the input attribute selector win and wipe chevron padding. Shrink-wrapped Field selects keep a token gutter so the caret is not painted over the last characters.
