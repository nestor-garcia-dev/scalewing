import { useCallback, useState } from 'react';

import { cellStatus, type GridModel, type GridPosition } from './grid-model.js';
import { type ScheduleGridLabels, type ScheduleGridProps } from './types.js';

/** How an item is being carried: by keys, by a press then a press, or by a drag. */
export type CarryMode = 'keyboard' | 'tap' | 'drag';

export type Carry = { itemId: string; mode: CarryMode };

/** A message for the polite live region; `id` changes so a repeat is read again. */
export type Announcement = { text: string; id: number };

type CarryOptions = Pick<
  ScheduleGridProps,
  'canDrop' | 'columns' | 'disabled' | 'onMove' | 'onSwap' | 'rows'
> & { labels: ScheduleGridLabels; model: GridModel };

/**
 * The carried item and what picking up, dropping and cancelling do: the
 * consumer's `canDrop` decides each drop, `onMove` or `onSwap` reports it,
 * and each step is announced. A carry ends when its item leaves the grid
 * or the grid is disabled.
 */
export function useScheduleCarry({
  canDrop,
  columns,
  disabled,
  labels,
  model,
  onMove,
  onSwap,
  rows,
}: CarryOptions) {
  const [held, setHeld] = useState<Carry | null>(null);
  const [announcement, setAnnouncement] = useState<Announcement>({
    text: '',
    id: 0,
  });
  const carry =
    held !== null && !disabled && model.itemById(held.itemId) ? held : null;

  // A carry that ended because the grid was disabled or its item left
  // stays ended: re-enabling never resumes it (state adjusted while
  // rendering, as React recommends over an effect).
  if (held !== null && carry === null) setHeld(null);

  const announce = useCallback((text: string) => {
    setAnnouncement((last) => ({ text, id: last.id + 1 }));
  }, []);

  const pickUp = useCallback(
    (itemId: string, mode: CarryMode) => {
      const item = model.itemById(itemId);
      if (disabled || !item) return;
      setHeld({ itemId, mode });
      announce(labels.pickedUp(item.label));
    },
    [announce, disabled, labels, model],
  );

  /** Puts the item back; returns where it is, for focus. */
  const cancel = useCallback((): GridPosition | undefined => {
    if (!carry) return undefined;
    setHeld(null);
    announce(labels.cancelled(model.itemById(carry.itemId)!.label));
    return model.positionOf(carry.itemId);
  }, [announce, carry, labels, model]);

  /** Drops on a cell: moves, swaps, cancels on its own cell, or says why not. */
  const drop = useCallback(
    (position: GridPosition) => {
      if (!carry) return;
      const item = model.itemById(carry.itemId)!;
      const status = cellStatus(model, carry.itemId, position, canDrop);
      if (status.kind === 'source') {
        cancel();
        return;
      }
      if (status.kind === 'blocked') {
        announce(status.reason);
        // A refused drag ends; keys and presses keep the item to try again.
        if (carry.mode === 'drag') setHeld(null);
        return;
      }
      setHeld(null);
      if (status.kind === 'swap') {
        const other = model.itemAt(position)!;
        onSwap(item.id, other.id);
        announce(labels.swapped(item.label, other.label));
        return;
      }
      onMove(item.id, model.slotAt(position));
      announce(
        labels.moved(
          item.label,
          rows[position.row]!.label,
          columns[position.column]!.label,
        ),
      );
    },
    [
      announce,
      canDrop,
      cancel,
      carry,
      columns,
      labels,
      model,
      onMove,
      onSwap,
      rows,
    ],
  );

  return { announcement, cancel, carry, drop, pickUp };
}
