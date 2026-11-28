import { listRowLargeMinHeight } from './list-row-metrics.js';

export const listGroupLargeClass = 'sw-list-group-lg';

const group = `.${listGroupLargeClass}`;

/*
 * The group's own rows only, never a ListGroup nested inside one of
 * them: its list's rows, the same list inside its scroll region when it
 * is bounded, and its footer's row.
 */
const ownRows = [
  `${group} > .sw-list > .sw-list-item > .sw-list-row`,
  `${group} > .sw-list-group-scroll > .sw-list > .sw-list-item > .sw-list-row`,
  `${group} > .sw-list-group-footer > .sw-list-item > .sw-list-row`,
].join(',\n');

/*
 * An `lg` group's rows stand at least 56 px on every pointer, past the
 * 44 px a pressable row takes on a coarse one, with their parts centred
 * on the row's height rather than set at its top, so a one-line name sits
 * in the middle of its tile. The chained classes outrank the
 * coarse-pointer target, which follows the rows in the sheet. Every row
 * of the group is the same floor, pressable or not, in a panel, plain
 * rows or tiles.
 */
export function cssListSizeClasses(): string {
  return `${ownRows} {
  align-items: center;
  min-height: ${listRowLargeMinHeight};
}`;
}

export function listSizeClassCatalog(): string[] {
  return [listGroupLargeClass];
}
