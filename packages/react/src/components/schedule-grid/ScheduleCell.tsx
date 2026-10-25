import { type PointerEvent, type ReactNode } from 'react';

import { cx } from '../../class-names.js';
import {
  cellName,
  type CellStatus,
  type GridModel,
  type GridPosition,
} from './grid-model.js';
import { type ScheduleGridLabels } from './types.js';

export type ScheduleCellProps = {
  model: GridModel;
  position: GridPosition;
  status: CellStatus;
  labels: ScheduleGridLabels;
  /** The cell the grid's one Tab stop is on. */
  tabStop: boolean;
  /** The drag's hover cell, or the focused cell while keys carry an item. */
  activeTarget: boolean;
  /** Items can be picked up. */
  movable: boolean;
  onPress: (position: GridPosition) => void;
  onFocus: (position: GridPosition) => void;
  onItemPointerDown: (event: PointerEvent<HTMLElement>, itemId: string) => void;
};

/** The visible words under a cell's content for its status, if any. */
function captionFor(
  status: CellStatus,
  activeTarget: boolean,
  disabledReason: string | undefined,
  labels: ScheduleGridLabels,
): string | null {
  if (status.kind === 'source') return labels.movingFrom;
  if (status.kind === 'blocked')
    return status.reason === disabledReason ? null : status.reason;
  if (!activeTarget) return null;
  if (status.kind === 'move') return labels.releaseToMove;
  if (status.kind === 'swap') return labels.releaseToSwap;
  return null;
}

/**
 * One cell of the grid: an item's card, the open words, or a disabled
 * cell's reason, then a caption for what it is while an item is carried.
 * Its name says the same in words.
 */
export function ScheduleCell({
  activeTarget,
  labels,
  model,
  movable,
  onFocus,
  onItemPointerDown,
  onPress,
  position,
  status,
  tabStop,
}: ScheduleCellProps) {
  const item = model.itemAt(position);
  const disabledReason = model.disabledReasonAt(position);
  const caption = captionFor(status, activeTarget, disabledReason, labels);
  let content: ReactNode;
  if (item)
    content = <div className="sw-schedule-grid-item">{item.content}</div>;
  else if (disabledReason !== undefined)
    content = <span className="sw-schedule-grid-reason">{disabledReason}</span>;
  else content = <span className="sw-schedule-grid-open">{labels.open}</span>;

  return (
    <td
      aria-label={cellName(model, position, status, labels)}
      className={cx(
        'sw-schedule-grid-cell',
        item
          ? 'sw-schedule-grid-cell-item'
          : disabledReason !== undefined
            ? 'sw-schedule-grid-cell-disabled'
            : 'sw-schedule-grid-cell-open',
        item && movable && 'sw-schedule-grid-cell-movable',
        // A disabled cell keeps its grey look while an item is carried,
        // unless it is the target, which says it is blocked.
        status.kind !== 'idle' &&
          (disabledReason === undefined || activeTarget) &&
          `sw-schedule-grid-cell-${status.kind}`,
        activeTarget && 'sw-schedule-grid-cell-target',
      )}
      data-column={position.column}
      data-row={position.row}
      data-sw-schedule-cell=""
      onClick={() => onPress(position)}
      onFocus={() => onFocus(position)}
      onPointerDown={
        item && movable
          ? (event) => onItemPointerDown(event, item.id)
          : undefined
      }
      role="gridcell"
      tabIndex={tabStop ? 0 : -1}
    >
      {/* The cell's name says all of this; the drawing is hidden so it is not read twice. */}
      <div aria-hidden="true" className="sw-schedule-grid-slot">
        {content}
        {caption !== null ? (
          <span className="sw-schedule-grid-caption">{caption}</span>
        ) : null}
      </div>
    </td>
  );
}
