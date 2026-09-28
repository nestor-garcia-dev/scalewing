---
'@scalewing/react-native': minor
---

Additive. `ActionRow`: the actions for what a screen shows as tinted tiles
under its title (iOS Contacts style), with the `ActionRowAction`,
`ActionRowMore`, and `ActionRowProps` types. Each tile is a consumer glyph
over a one-line label on the new `accentSubtle` tint, a button named by its
label or a longer `accessibilityLabel`, and `disabled` dims it in place.
Four equal slots keep tiles the same size and place for one to four
actions; past four, the fourth slot is `more`, whose `onPress` receives the
remaining actions, and `more` is required. `testID` works on the row, each
action, and More. Needs `@scalewing/tokens` with `accentSubtle`
(`futmas-accent-subtle.md`). Consumer request:
`docs/requests/futmas-action-row.md`.
