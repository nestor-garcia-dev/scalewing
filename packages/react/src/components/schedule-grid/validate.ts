import {
  type ScheduleGridAxisEntry,
  type ScheduleGridProps,
  type ScheduleGridSlot,
} from './types.js';

const name = 'ScheduleGrid';

function isBlank(words: unknown): boolean {
  return typeof words !== 'string' || !words.trim();
}

function assertAxis(
  axis: 'columns' | 'rows',
  entries: readonly ScheduleGridAxisEntry[],
): Set<string> {
  if (!Array.isArray(entries) || entries.length === 0)
    throw new RangeError(`${name} needs at least one of ${axis}`);
  const ids = new Set<string>();
  for (const entry of entries) {
    if (isBlank(entry?.id) || isBlank(entry.label))
      throw new RangeError(`${name} ${axis} need nonempty ids and labels`);
    if (ids.has(entry.id))
      throw new RangeError(`${name} ${axis} repeat the id "${entry.id}"`);
    ids.add(entry.id);
  }
  return ids;
}

/** Fails closed on a slot naming a column or row the grid does not have. */
function assertSlot(
  what: string,
  slot: ScheduleGridSlot,
  columnIds: Set<string>,
  rowIds: Set<string>,
): void {
  if (!columnIds.has(slot.columnId) || !rowIds.has(slot.rowId))
    throw new RangeError(
      `${name} ${what} is in a column or row it does not have`,
    );
}

/**
 * Fails closed on a grid it cannot name or draw: a blank label or
 * rowsLabel, no columns
 * or rows, a blank or repeated id or label, an item or disabled cell
 * outside the grid, a blank item label or reason, a repeated item id, two
 * items in one cell, one cell disabled twice, or a disabled cell that
 * holds an item (its reason would be hidden).
 */
export function assertScheduleGrid({
  columns,
  disabledCells = [],
  items,
  label,
  rows,
  rowsLabel,
}: ScheduleGridProps): void {
  if (isBlank(label)) throw new RangeError(`${name} label must be nonempty`);
  if (rowsLabel !== undefined && isBlank(rowsLabel))
    throw new RangeError(`${name} rowsLabel must be nonempty when given`);
  const columnIds = assertAxis('columns', columns);
  const rowIds = assertAxis('rows', rows);
  const itemIds = new Set<string>();
  const filled = new Set<string>();
  for (const item of items) {
    if (isBlank(item?.id) || isBlank(item.label))
      throw new RangeError(`${name} items need nonempty ids and labels`);
    if (itemIds.has(item.id))
      throw new RangeError(`${name} items repeat the id "${item.id}"`);
    itemIds.add(item.id);
    assertSlot(`item "${item.id}"`, item, columnIds, rowIds);
    const cell = JSON.stringify([item.rowId, item.columnId]);
    if (filled.has(cell))
      throw new RangeError(`${name} holds one item per cell`);
    filled.add(cell);
  }
  const disabled = new Set<string>();
  for (const cell of disabledCells) {
    if (isBlank(cell?.reason))
      throw new RangeError(`${name} disabledCells need a reason`);
    assertSlot('a disabled cell', cell, columnIds, rowIds);
    const key = JSON.stringify([cell.rowId, cell.columnId]);
    if (disabled.has(key))
      throw new RangeError(`${name} disables a cell twice`);
    disabled.add(key);
    if (filled.has(key))
      throw new RangeError(`${name} disables a cell that holds an item`);
  }
}
