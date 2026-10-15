import { typedInputs } from './css-document.js';
import { type TableColumnSize, tableColumnSizes } from './css-table-layout.js';

/**
 * The widths a field's control can be capped at: the Table column sizes
 * (`xs` 4rem to `xl` 16rem), so a short value such as a rate or a count
 * sits in a box its own size instead of across the form's column.
 */
export type FieldWidth = TableColumnSize;

export const fieldWidths = Object.keys(tableColumnSizes) as FieldWidth[];

export function fieldWidthClass(width: FieldWidth): string {
  return `sw-field-width-${width}`;
}

export function assertFieldWidth(width: unknown): void {
  if (width !== undefined && !(fieldWidths as unknown[]).includes(width))
    throw new RangeError(`Unknown Field width: ${String(width)}`);
}

/**
 * The field's own control: a native text control or select, or the frame
 * round an adorned or search input. A checkbox, radio, range, colour or
 * file input keeps its own size.
 */
const control = `:is(${typedInputs}, select, .sw-field-adorned, .sw-field-search)`;

/*
 * A sized field keeps its label, description and error at the column's
 * width and caps only its control, at the start of the column, never wider
 * than the column on a narrow screen. Every capped control measures its
 * border box, and a resized textarea stays inside the column. A select
 * is a content box in the canvas (its height leaves out its two
 * hairlines), so a sized one states the whole control height instead, at
 * md or xs.
 */
export function cssFieldWidthClasses(): string {
  const widths = Object.entries(tableColumnSizes)
    .map(
      ([size, rem]) =>
        `.${fieldWidthClass(size as FieldWidth)} { --sw-field-width: ${rem}rem; }`,
    )
    .join('\n');
  return `${widths}

.sw-field-sized > ${control} {
  align-self: flex-start;
  box-sizing: border-box;
  inline-size: min(100%, var(--sw-field-width));
  max-inline-size: 100%;
}

[data-theme] .sw-field-sized > select {
  height: var(--sw-control-md-min-height);
}

[data-theme] .sw-field-xs.sw-field-sized > select {
  height: var(--sw-control-xs-min-height);
}`;
}

export function fieldWidthClassCatalog(): string[] {
  return ['sw-field-sized', ...fieldWidths.map(fieldWidthClass)];
}
