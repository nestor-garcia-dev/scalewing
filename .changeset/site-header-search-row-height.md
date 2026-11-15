---
'@scalewing/react': patch
---

`SiteHeader` search: below `lg`, a result row counts its padding inside its 44 px floor (`box-sizing: border-box`), so on a page without a border-box reset a row with a title only, such as a site's "See all results" row, is 44 px tall instead of 68 px with an empty band under its words. Reported by FutMas's F-024 review.
