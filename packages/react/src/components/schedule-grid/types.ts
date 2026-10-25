import { type ReactNode } from 'react';

/** A column (such as a field) or a row (such as a time): an id and its words. */
export type ScheduleGridAxisEntry = { id: string; label: string };

/** A cell: where a column and a row meet. */
export type ScheduleGridSlot = { columnId: string; rowId: string };

/** One thing placed in a cell, such as a game. */
export type ScheduleGridItem = ScheduleGridSlot & {
  id: string;
  /** Its name in words ("Otter Pool vs Heron Marsh"), read for its cell and in announcements. */
  label: string;
  /** What its card shows; drawn as it is and hidden from assistive technology (the cell is named by `label`). Hold no controls in it. */
  content: ReactNode;
};

/** A cell nothing may be put in, whatever is moved, and why ("Closed for mowing"). */
export type ScheduleGridDisabledCell = ScheduleGridSlot & { reason: string };

/** Where a carried item would go: an empty cell, or another item to swap with. */
export type ScheduleGridTarget =
  | ({ kind: 'move' } & ScheduleGridSlot)
  | ({ kind: 'swap'; itemId: string } & ScheduleGridSlot);

/** The consumer's answer for a target: `true` allows it; a reason blocks it. */
export type ScheduleGridDropCheck = true | { reason: string };

/**
 * How an item was picked up: by keys, by a press then a press (touch or a
 * click), or by a mouse or pen drag.
 */
export type ScheduleGridCarryMode = 'keyboard' | 'tap' | 'drag';

/** The grid's own words, English by default. */
export type ScheduleGridLabels = {
  /** An empty cell. */
  open: string;
  /** The carried item's own cell. */
  movingFrom: string;
  /** An empty cell that would take the carried item. */
  releaseToMove: string;
  /** An item the carried one would swap with. */
  releaseToSwap: string;
  /** How to move an item with keys; the grid's description. */
  instructions: string;
  /**
   * Announced when an item is picked up; `mode` says how, so the words can
   * fit the input (a one-argument function still works).
   */
  pickedUp: (item: string, mode: ScheduleGridCarryMode) => string;
  /** Announced after a move to an empty cell. */
  moved: (item: string, row: string, column: string) => string;
  /** Announced after a swap. */
  swapped: (item: string, other: string) => string;
  /** Announced when a move is cancelled. */
  cancelled: (item: string) => string;
};

export type ScheduleGridProps = {
  /** The grid's name ("Sunday April 4 by field"). */
  label: string;
  columns: readonly ScheduleGridAxisEntry[];
  rows: readonly ScheduleGridAxisEntry[];
  /**
   * The header over the rows' labels ("Time"). Without it that corner is
   * blank and hidden from assistive technology.
   */
  rowsLabel?: string;
  items: readonly ScheduleGridItem[];
  /** Cells nothing may be put in, each with its reason. */
  disabledCells?: readonly ScheduleGridDisabledCell[];
  /**
   * Whether `itemId` may go to `target`. Asked for every cell while an item
   * is carried; a reason blocks the cell and is shown in it. Omitted, every
   * target is allowed. The grid holds no rules of its own.
   */
  canDrop?: (
    itemId: string,
    target: ScheduleGridTarget,
  ) => ScheduleGridDropCheck;
  /** An item was dropped on an allowed empty cell. */
  onMove: (itemId: string, slot: ScheduleGridSlot) => void;
  /** An item was dropped on an allowed other item. */
  onSwap: (itemId: string, otherItemId: string) => void;
  /** Nothing can be picked up; the cells still take focus. */
  disabled?: boolean;
  labels?: Partial<ScheduleGridLabels>;
};
