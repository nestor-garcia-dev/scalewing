---
'@scalewing/tokens': minor
---

Additive. Semantic colours `secondary`, `onSecondary`, `tertiary`,
`onTertiary`, and `subtle`, and a `signal` named palette (cerulean primary,
near-black secondary, violet tertiary). An unset `secondary` follows
`surface`, so existing secondary actions keep their outlined look.
Renderers pick these up through their caret dependency (ADR 0009); the web
stylesheet emits the new custom properties with its next release, which
the Button `tertiary` change brings. Consumer request:
`docs/requests/futmas-action-tiers.md`.
