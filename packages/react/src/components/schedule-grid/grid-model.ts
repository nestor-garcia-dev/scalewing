import {
  type ScheduleGridDropCheck,
  type ScheduleGridItem,
  type ScheduleGridLabels,
  type ScheduleGridProps,
  type ScheduleGridSlot,
  type ScheduleGridTarget,
} from './types.js';

/** A cell by its place: row and column indexes. */
export type GridPosition = { row: number; column: number };

/** What a cell is while an item is carried, or `idle` while none is. */
export type CellStatus =
  | { kind: 'idle' }
  | { kind: 'source' }
  | { kind: 'move' }
  | { kind: 'swap' }
  | { kind: 'blocked'; reason: string };

export type GridModel = {
  rowCount: number;
  columnCount: number;
  itemAt: (position: GridPosition) => ScheduleGridItem | undefined;
  disabledReasonAt: (position: GridPosition) => string | undefined;
  positionOf: (itemId: string) => GridPosition | undefined;
  slotAt: (position: GridPosition) => ScheduleGridSlot;
  itemById: (itemId: string) => ScheduleGridItem | undefined;
};

function cellKey(rowIndex: number, columnIndex: number): string {
  return `${rowIndex}:${columnIndex}`;
}

/** Index lookups for one render's props (already validated). */
export function buildGridModel({
  columns,
  disabledCells = [],
  items,
  rows,
}: Pick<
  ScheduleGridProps,
  'columns' | 'disabledCells' | 'items' | 'rows'
>): GridModel {
  const rowIndex = new Map(rows.map((row, index) => [row.id, index]));
  const columnIndex = new Map(
    columns.map((column, index) => [column.id, index]),
  );
  const place = (slot: ScheduleGridSlot): GridPosition => ({
    row: rowIndex.get(slot.rowId)!,
    column: columnIndex.get(slot.columnId)!,
  });
  const byCell = new Map<string, ScheduleGridItem>();
  const byId = new Map<string, ScheduleGridItem>();
  for (const item of items) {
    const { row, column } = place(item);
    byCell.set(cellKey(row, column), item);
    byId.set(item.id, item);
  }
  const reasons = new Map<string, string>();
  for (const cell of disabledCells) {
    const { row, column } = place(cell);
    reasons.set(cellKey(row, column), cell.reason);
  }
  return {
    rowCount: rows.length,
    columnCount: columns.length,
    itemAt: ({ row, column }) => byCell.get(cellKey(row, column)),
    disabledReasonAt: ({ row, column }) => reasons.get(cellKey(row, column)),
    positionOf: (itemId) => {
      const item = byId.get(itemId);
      return item ? place(item) : undefined;
    },
    slotAt: ({ row, column }) => ({
      rowId: rows[row]!.id,
      columnId: columns[column]!.id,
    }),
    itemById: (itemId) => byId.get(itemId),
  };
}

/**
 * The cell a grid key moves focus to: arrows by one cell (the horizontal
 * ones swapped in right-to-left), Home and End to the row's ends, and with
 * Control (or ⌘) to the grid's first and last cells. Null for other keys;
 * an arrow at an edge stays put.
 */
export function gridKeyTarget(
  key: { key: string; ctrlKey: boolean; metaKey: boolean },
  from: GridPosition,
  size: { rowCount: number; columnCount: number },
  rtl: boolean,
): GridPosition | null {
  const lastRow = size.rowCount - 1;
  const lastColumn = size.columnCount - 1;
  const clampRow = (row: number) => Math.min(lastRow, Math.max(0, row));
  const clampColumn = (column: number) =>
    Math.min(lastColumn, Math.max(0, column));
  const toGrid = key.ctrlKey || key.metaKey;
  switch (key.key) {
    case 'ArrowUp':
      return { ...from, row: clampRow(from.row - 1) };
    case 'ArrowDown':
      return { ...from, row: clampRow(from.row + 1) };
    case 'ArrowLeft':
      return { ...from, column: clampColumn(from.column + (rtl ? 1 : -1)) };
    case 'ArrowRight':
      return { ...from, column: clampColumn(from.column + (rtl ? -1 : 1)) };
    case 'Home':
      return toGrid ? { row: 0, column: 0 } : { ...from, column: 0 };
    case 'End':
      return toGrid
        ? { row: lastRow, column: lastColumn }
        : { ...from, column: lastColumn };
    default:
      return null;
  }
}

/** The target a cell would be for `itemId`: a move to it, or a swap with its item. */
export function targetAt(
  model: GridModel,
  position: GridPosition,
): ScheduleGridTarget {
  const slot = model.slotAt(position);
  const other = model.itemAt(position);
  return other
    ? { kind: 'swap', itemId: other.id, ...slot }
    : { kind: 'move', ...slot };
}

/** Normalises the consumer's answer, failing closed on a blank reason. */
function checkDrop(
  canDrop: ScheduleGridProps['canDrop'],
  itemId: string,
  target: ScheduleGridTarget,
): { reason: string } | null {
  const answer: ScheduleGridDropCheck = canDrop
    ? canDrop(itemId, target)
    : true;
  if (answer === true) return null;
  if (typeof answer?.reason !== 'string' || !answer.reason.trim())
    throw new RangeError(
      'ScheduleGrid canDrop must return true or a nonempty reason',
    );
  return answer;
}

/** What a cell is for the carried item (none: `idle`). */
export function cellStatus(
  model: GridModel,
  carriedId: string | null,
  position: GridPosition,
  canDrop: ScheduleGridProps['canDrop'],
): CellStatus {
  if (carriedId === null) return { kind: 'idle' };
  if (model.itemAt(position)?.id === carriedId) return { kind: 'source' };
  const disabled = model.disabledReasonAt(position);
  if (disabled !== undefined) return { kind: 'blocked', reason: disabled };
  const target = targetAt(model, position);
  const blocked = checkDrop(canDrop, carriedId, target);
  if (blocked) return { kind: 'blocked', reason: blocked.reason };
  return { kind: target.kind };
}

/** A cell's name: what it holds, then what it would do with the carried item. */
export function cellName(
  model: GridModel,
  position: GridPosition,
  status: CellStatus,
  labels: ScheduleGridLabels,
): string {
  const item = model.itemAt(position);
  const disabled = model.disabledReasonAt(position);
  const holds = item ? item.label : (disabled ?? labels.open);
  switch (status.kind) {
    case 'source':
      return `${holds}, ${labels.movingFrom}`;
    case 'move':
      return `${holds}, ${labels.releaseToMove}`;
    case 'swap':
      return `${holds}, ${labels.releaseToSwap}`;
    case 'blocked':
      return status.reason === holds ? holds : `${holds}, ${status.reason}`;
    default:
      return holds;
  }
}
