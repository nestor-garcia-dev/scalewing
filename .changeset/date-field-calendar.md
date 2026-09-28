---
'@scalewing/react': minor
---

`DateField` draws its own calendar instead of using the browser's `<input type="date">`, so it looks the same in every browser, follows Scalewing's tokens, and shows up in screenshots. The props, the date-only `YYYY-MM-DD` contract, and the `RangeError` guards are unchanged.

- People type the date into a text entry in the locale's numeric order (`MM/DD/YYYY` for en-US, `DD/MM/YYYY` for es); ISO `YYYY-MM-DD` and eight bare digits also work. A keystroke commits once the entry's last field is at full width (a four-digit year, or two digits for a trailing day or month); a shorter last field commits on blur or Enter. Typed text stays when the parent keeps the old value. Text that is not a date keeps the last value and, after the person leaves the field, sets `aria-invalid` with a message. As with the native input, the entry blocks form submission while its text is not a date or its date is outside `min`/`max` (`setCustomValidity`).
- A calendar button opens a WAI-ARIA date picker dialog anchored under the field on the popover layer, with month and year selectors for jumping decades, Today, and Clear (only when not `required`). Arrows, Home/End, PageUp/PageDown, and Shift+PageUp/PageDown move focus; Enter or Space selects; Escape closes and returns focus to the button. Days outside `min`/`max` are `aria-disabled`, the month selector offers only months inside them, and padding past `0001-01-01` or `9999-12-31` is blank and inert.
- New optional props: `locale` (BCP 47; defaults to the nearest `lang` attribute, then `en-US`), `weekStartsOn` (`0` Sunday by default, or `1` Monday), and `labels` for the control's own words (English defaults), including `outOfRange`, the form validation message for a date outside `min`/`max`. New types `DateFieldLabels` and `WeekStart`. New generated `sw-date-field-*` classes for the control and calendar.
- Migration for tests: there is no `input[type=date]` any more. Find the entry by its label (`getByLabel('Hire date')` or `getByRole('textbox', { name: 'Hire date' })`) and `fill` it in the locale's order or in ISO, or open the calendar with the **Choose date** button. The input's value is now the locale's display text (`03/10/2024`), not `2024-03-10`; assert the serialized value from your own state.

No new dependencies.
