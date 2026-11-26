---
'@scalewing/react-native': minor
---

`TabBar` destinations take an optional `badge` count: a danger pill with the
`onDanger` count over the icon's top end corner, shown only for a positive
whole number and reading `99+` past 99. The tab announces it as its
accessibility value after the label, the way iOS reads a tab badge
("Inbox, 3 items"); `badgeAccessibilityLabel` replaces the default English
"1 item" / "N items" with the consumer's words. Destination labels now
shrink to 70% of their size (`adjustsFontSizeToFit`) before they ellipsize,
destinations drop their 4-point side padding, and the gap before the
trailing control narrows from space step 3 to 2, so five labels of up to 13
characters fit beside the trailing control on a 390-point phone at the
default text size. No new tokens and no new dependency.
