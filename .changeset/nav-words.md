---
'@scalewing/react': minor
---

`Nav` `appearance` (`NavAppearance`, `navAppearances`): `'default'` (unchanged) or `'words'`, every destination (a link or a Button of any variant) as plain words, the others muted at medium weight and the current one (`aria-current`) in the text color at label weight, with no fill, visible border or underline (destinations need visible words: a glyph-only one keeps `default`); forced colors draw the current one's border in Highlight and underline it (`docs/requests/teisoro-nav-words.md`, Teisoro F-011 release R6, S17 shell). An unknown value throws a `RangeError`. New generated class `sw-nav-words`. No new tokens or dependencies.
