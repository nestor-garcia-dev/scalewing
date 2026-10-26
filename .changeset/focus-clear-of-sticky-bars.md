---
'@scalewing/react': patch
---

Focus stays clear of sticky chrome (WCAG 2.4.11). `AppShell` measures its `pageBar` (as it does the compact bar) and gives everything in `main` a `scroll-margin-block-start` past the page bar and, below `lg`, the compact bar, so a control the browser scrolls into view on focus stops under them, not behind them. A stuck `ActionBar` gives the document a `scroll-padding-block-end` of its one-row height and lift, so a control above it is not scrolled behind it. No API change.
