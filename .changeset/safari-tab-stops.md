---
'@scalewing/react': patch
---

Every press control and link now renders an explicit `tabindex="0"` (Teisoro F-011 task 2205), so Safari users reach it with Tab: Safari's default leaves a `<button>`, a link, a checkbox and a radio out of the Tab order unless it carries a `tabindex`, so Tab from a field went past them to the address bar. Covered: `Button` (with `CalendarButton` and `InfoTip`), `Box as="a"` with an `href`, `SectionNav` links, the `Select`, `MultiSelect` and `ActionMenu` triggers, `SegmentedControl` items, `DateField`'s calendar button and month steps, a search `Field`'s clear button, `Table` sort and `TableCell onPress` buttons, `Checkbox` (and `MultiSelect`'s rows), `Switch`, and the checked (else first enabled) radio of a `RadioGroup` or `FilterChips`. A consumer's `tabIndex` wins; a `Stepper`'s − and + and roving items keep their `-1`. No new prop, class or token, no new dependency.
