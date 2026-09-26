---
'@scalewing/react': minor
---

Button `variant="tertiary"` is a solid fill on `--sw-color-tertiary` with
`--sw-color-onTertiary`. `secondary` now fills with `--sw-color-secondary`
and draws `--sw-button-secondary-border`, which stays the hairline unless a
palette fills the secondary action (for example `signal`). The stylesheet
emits the new semantic colour properties. Default and cerulean themes look
unchanged.
