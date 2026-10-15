/**
 * DateField's calendar entry: one neutral Button showing the chosen day (or
 * the words that ask for one) after the calendar glyph, shaped as a field's
 * control rather than a pill, sized to its words on one line at the
 * column's start, the danger edge while the field is invalid.
 */
export const dateFieldEntries = ['typed', 'calendar'] as const;
export type DateFieldEntry = (typeof dateFieldEntries)[number];

export function assertDateFieldEntry(entry: unknown): void {
  if (!(dateFieldEntries as readonly unknown[]).includes(entry))
    throw new RangeError(`Unknown DateField entry: ${String(entry)}`);
}

const entry = '.sw-button.sw-date-field-calendar-entry';

export function cssDateFieldCalendarEntryClasses(): string {
  return `${entry} {
  align-self: flex-start;
  border-radius: var(--sw-radius-sm);
  flex: none;
  justify-content: flex-start;
  max-width: 100%;
  text-align: start;
  white-space: nowrap;
}

/* A long day or word in a narrow column ends in an ellipsis; the name keeps it whole. */
.sw-date-field-calendar-entry-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

${entry} .sw-date-field-glyph {
  height: var(--sw-space-4);
  width: var(--sw-space-4);
}

${entry}.sw-date-field-calendar-entry-invalid {
  border-color: var(--sw-color-danger);
}

@media (forced-colors: active) {
  ${entry}.sw-date-field-calendar-entry-invalid { border-color: Mark; }
}`;
}

export function dateFieldCalendarEntryClassCatalog(): string[] {
  return [
    'sw-date-field-calendar-entry',
    'sw-date-field-calendar-entry-text',
    'sw-date-field-calendar-entry-invalid',
  ];
}
