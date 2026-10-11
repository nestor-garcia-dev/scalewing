---
'@scalewing/react': minor
---

`SectionNav` item `count` and `appearance="filled"` (`docs/requests/teisoro-section-nav-count.md`, Teisoro F-011 release R4):

- `SectionNavItem.count?: number`: a 20 px filled pill after the label (danger with its on-colour figures, a `CanvasText` edge in forced colours), part of the link's accessible name; 0 shows none; a count that is not a whole number from 0 throws a `RangeError`.
- `SectionNavItem.countLabel?: string`: the count in words, read in place of the bare number (the pill then hidden from assistive technology); blank or without `count` throws.
- `appearance?: 'underline' | 'filled'` (`SectionNavAppearance`, `sectionNavAppearances`): `filled` drops the hairline and the underline or start bar, sets every link at the `sm` control (44 px on a coarse pointer) at weight 500 and fills the current one at 600 (a 2 px `Highlight` edge in forced colours), in the row or the side list; an unknown value throws a `RangeError`.
- New classes `sw-section-nav-filled` and `sw-section-nav-count`. No new tokens or dependencies.
