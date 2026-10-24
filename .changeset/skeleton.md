---
'@scalewing/react': minor
---

`Skeleton`: grey placeholder bars where content is loading, in place of a page spinner. A polite status named by `label` (read once), the bars hidden; `variant="lines"` (default) is 1–6 bars of text with ragged ends, the last shorter, and `variant="rows"` is list rows (a mark and a bar, 44 px, hairlines between). The bars pulse gently and stay still under reduced motion; forced colours keep their edges. New classes `sw-skeleton*`; blank words, `lines` outside 1–6 or an unknown variant throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-skeleton.md`.
