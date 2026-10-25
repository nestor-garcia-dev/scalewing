import { coarsePointerQuery, touchTarget } from './touch-target.js';

export const tableSelectCellClass = 'sw-table-select';

/*
 * TableSelectCell's column: as wide as the checkbox (its padding outside),
 * in an auto or a fixed table alike; the box centred in the cell. On a
 * coarse pointer the column widens to the box's 44 px target
 * (`sw-checkbox-label-hidden`, css-checkbox.ts).
 */
export function cssTableSelectClasses(): string {
  return `.sw-table .${tableSelectCellClass} {
  width: var(--sw-space-5);
}

.sw-table .${tableSelectCellClass} .sw-checkbox {
  align-items: center;
}

@media ${coarsePointerQuery} {
  .sw-table .${tableSelectCellClass} { width: ${touchTarget}; }
}`;
}

export function tableSelectClassCatalog(): string[] {
  return [tableSelectCellClass];
}
