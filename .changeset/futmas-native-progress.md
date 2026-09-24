---
'@scalewing/react-native': minor
---

Native `Progress` joins the web one with the same props: `label`, `value`,
`max`, and `tone` (`accent`, `success`, or `danger`). It shows the label,
a muted "value / max" count, and a pill track filled to value / max, and it
is one accessible progress bar with its value range. Invalid labels and
ranges throw a `RangeError` (see `docs/requests/futmas-native-progress.md`).
