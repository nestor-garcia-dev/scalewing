---
'@scalewing/react': patch
---

A `required` `DateField` marks its label with the same `aria-hidden` asterisk as `Field` (`sw-field-required`) (`docs/requests/teisoro-date-field.md`, 2026-09-28 follow-up, Teisoro NSF-15). Before, a required date looked optional beside required fields. The entry's accessible name is unchanged; the label's text content now ends in " *", so a test that finds the entry with an exact `getByLabelText` should use its role and name instead.

No API change and no new dependencies.
