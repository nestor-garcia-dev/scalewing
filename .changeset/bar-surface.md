---
'@scalewing/react': minor
---

A full-width bar look for page chrome, opt-in (`docs/requests/teisoro-app-header-bar.md`, `docs/requests/teisoro-box-border-bottom.md`, Teisoro F-011 release R6):

- `AppHeader` `appearance` (`AppHeaderAppearance`, `appHeaderAppearances`): `'glass'` (default, unchanged) or `'bar'`, a full-width band of the solid surface with the border hairline under it, no blur, rounding, side or top border. An unknown value throws a `RangeError`.
- `Box` `border="bottom"` draws only the hairline under the box, for a sub-bar under the header. Every `Box`-based component takes it.

New generated classes `sw-app-header-bar`, `sw-border-bottom`. No new tokens or dependencies.
