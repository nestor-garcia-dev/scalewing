---
'@scalewing/react-native': minor
---

New `MatchCard`: one upcoming match as a card that opens it. It shows an
optional muted `leading` line, the large `when` line with a chevron, two
`sides` (`{ name, caption?, crest?, initials? }`, home first) each with a
round mark holding the consumer's crest or the side's initials, the `versus`
word between them (default "vs"), and up to two centred muted `details`
lines (a third throws a `RangeError`). It draws the outlined card's surface,
hairline and large radius, fills with `subtle` while pressed, and is one
`button` named by its visible lines unless `accessibilityLabel` replaces it,
with an optional `accessibilityHint` and `testID`. Long names wrap; at
accessibility text sizes the sides stack. New types `MatchCardProps` and
`MatchCardSide`. No new tokens and no new dependency.
