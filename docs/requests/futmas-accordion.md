# Native Accordion

Scalewing request from FutMas, September 11, 2026.
Renderer: react-native. Surface: Accordion.

The user requests collapsible league match groups and an independently
pressable heading that preserves navigation. Existing Box/Card can group
content but do not own disclosure semantics, chevron state, or split header
touch targets. The existing Accordion is DOM-only.

One renderer lane: add controlled `Accordion` with title, optional leading
and metadata slots, open/onOpenChange, a localized disclosure label, and an
optional separately labeled title action. No nested presses. Default header
press toggles when no title action exists. The disclosure target is at least
44 points; collapsed children unmount. Theme tokens own all geometry/colors.

Validation: native style mapper tests, consumer expand/collapse and separate
navigation tests, native-example demo, types/builds and iOS bundling. Add a
minor changeset. Verify through the existing FutMas sibling link. No publish.

Status: implemented. Before the renderer-test correction, the latest full
`pnpm check` passed 105 workspace tests plus 3 release tests; the earlier 106
total was historical evidence, not the current count. After the correction,
the focused native suite passes 35 tests; a new full-check count is pending.
FutMas consumer tests and iOS production bundle pass against the installed
local link. Await native screenshot acceptance. User-requested follow-up to
F-012-S01; no publish.
