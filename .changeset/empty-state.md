---
'@scalewing/react': minor
---

`EmptyState` (new): where a list or a page has nothing yet, a centred panel on the surface with a dashed hairline edge that fills its column (a page column or a Card). `title` is a heading at `titleAs` (`h2` by default, or `h3`; `emptyStateTitleElements`), `description` a muted line, `icon` a decorative glyph in a quiet square, `actions` a centred row that wraps (44 px Buttons on a coarse pointer). Forced colours keep the dashed edge. A blank `title` or `description` or an unknown `titleAs` throws a `RangeError`. New classes `sw-empty-state`, `sw-empty-state-icon`, `sw-empty-state-title`, `sw-empty-state-description`, `sw-empty-state-actions`. No new tokens or dependencies. Request: `docs/requests/futmas-empty-state.md`.
