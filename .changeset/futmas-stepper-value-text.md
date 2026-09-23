---
'@scalewing/react-native': patch
---

`Stepper` announces its value as the number itself (see
`docs/requests/futmas-stepper-value-text.md`). iOS read the adjustable value
as a percentage of its range, so VoiceOver said "14 percent" for 1 of 1 to 8
and UI tests read "14%". No prop changes.
