'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import { cx } from '../class-names.js';
import { ScheduleCell } from './schedule-grid/ScheduleCell.js';
import { cellPositionOf, gridKeyAction } from './schedule-grid/grid-keys.js';
import {
  buildGridModel,
  cellStatus,
  type GridPosition,
} from './schedule-grid/grid-model.js';
import { scheduleGridLabels } from './schedule-grid/labels.js';
import { type ScheduleGridProps } from './schedule-grid/types.js';
import { usePointerDrag } from './schedule-grid/use-pointer-drag.js';
import { useScheduleCarry } from './schedule-grid/use-schedule-carry.js';
import { assertScheduleGrid } from './schedule-grid/validate.js';

export { defaultScheduleGridLabels } from './schedule-grid/labels.js';
export type {
  ScheduleGridAxisEntry,
  ScheduleGridCarryMode,
  ScheduleGridDisabledCell,
  ScheduleGridDropCheck,
  ScheduleGridItem,
  ScheduleGridLabels,
  ScheduleGridProps,
  ScheduleGridSlot,
  ScheduleGridTarget,
} from './schedule-grid/types.js';

/**
 * Items in a grid of rows (such as times) by columns (such as fields),
 * moved between cells: a mouse drag with one hover target, a press then a
 * press (touch), or keys (M or Space picks up, arrows choose, Enter drops,
 * Escape cancels). A carry by keys or presses is cancelled when focus or a
 * press leaves the grid. Dropping on another item swaps the two. The consumer's
 * `canDrop` decides every target; each step is announced politely. Invalid
 * props throw a `RangeError`.
 */
export function ScheduleGrid(props: ScheduleGridProps) {
  assertScheduleGrid(props);
  const {
    canDrop,
    columns,
    disabled = false,
    disabledCells,
    items,
    label,
    labels,
    onMove,
    onSwap,
    rows,
    rowsLabel,
  } = props;
  const words = useMemo(() => scheduleGridLabels(labels), [labels]);
  const model = useMemo(
    () => buildGridModel({ columns, disabledCells, items, rows }),
    [columns, disabledCells, items, rows],
  );
  const tableRef = useRef<HTMLTableElement>(null);
  const instructionsId = useId();
  const [focused, setFocused] = useState<GridPosition>({ row: 0, column: 0 });
  const [hover, setHover] = useState<GridPosition | null>(null);
  const focus = {
    row: Math.min(focused.row, rows.length - 1),
    column: Math.min(focused.column, columns.length - 1),
  };
  const { announcement, cancel, carry, drop, pickUp } = useScheduleCarry({
    canDrop,
    columns,
    disabled,
    labels: words,
    model,
    onMove,
    onSwap,
    rows,
  });

  const focusCell = useCallback((position: GridPosition) => {
    setFocused(position);
    tableRef.current
      ?.querySelector<HTMLElement>(
        `[data-row="${position.row}"][data-column="${position.column}"]`,
      )
      ?.focus();
  }, []);

  const drag = usePointerDrag(tableRef, !disabled, {
    onStart: (itemId) => pickUp(itemId, 'drag'),
    onHover: setHover,
    onDrop: (position) => {
      setHover(null);
      if (position) drop(position);
      else cancel();
    },
  });

  // While keys or presses carry an item, a press outside the grid puts it back.
  useEffect(() => {
    if (!carry || carry.mode === 'drag') return;
    const onDown = (event: PointerEvent) => {
      if (!tableRef.current?.contains(event.target as Node)) cancel();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [cancel, carry]);

  // Focus leaving the grid puts a key or press carry back; the window
  // losing focus (another app, a devtools click) does not.
  function onBlur(event: FocusEvent<HTMLTableElement>) {
    if (!carry || carry.mode === 'drag') return;
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    if (next === null && !document.hasFocus()) return;
    cancel();
  }

  // A press on a header (not focusable) keeps focus where it is, so it
  // never reads as focus leaving the grid and a carry survives it.
  function onMouseDown(event: MouseEvent<HTMLTableElement>) {
    if (!(event.target as Element).closest('[role="gridcell"]'))
      event.preventDefault();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    const position = cellPositionOf(event.target);
    if (!position) return;
    const action = gridKeyAction(event, position, {
      model,
      carrying: carry !== null,
      disabled,
      rtl: getComputedStyle(event.currentTarget).direction === 'rtl',
    });
    if (action === null) return;
    event.preventDefault();
    if (action.type === 'cancel') {
      const source = cancel();
      if (source) focusCell(source);
    } else if (action.type === 'drop') drop(action.position);
    else if (action.type === 'pickUp') pickUp(action.itemId, 'keyboard');
    else focusCell(action.position);
  }

  function onPress(position: GridPosition) {
    if (drag.consumeClick()) return;
    if (carry) {
      drop(position);
      return;
    }
    const item = model.itemAt(position);
    if (item && !disabled) pickUp(item.id, 'tap');
  }

  const activeTarget =
    carry?.mode === 'drag' ? hover : carry?.mode === 'keyboard' ? focus : null;

  return (
    <div
      className={cx(
        'sw-schedule-grid',
        carry?.mode === 'drag' && 'sw-schedule-grid-dragging',
      )}
    >
      <table
        aria-describedby={instructionsId}
        aria-label={label}
        className="sw-schedule-grid-table"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        ref={tableRef}
        role="grid"
        style={
          { '--sw-schedule-grid-columns': columns.length } as CSSProperties
        }
      >
        <thead>
          <tr>
            {rowsLabel !== undefined ? (
              <th className="sw-schedule-grid-corner" scope="col">
                {rowsLabel}
              </th>
            ) : (
              <td aria-hidden="true" className="sw-schedule-grid-corner" />
            )}
            {columns.map((column) => (
              <th
                className="sw-schedule-grid-column"
                key={column.id}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <th className="sw-schedule-grid-row" scope="row">
                {row.label}
              </th>
              {columns.map((column, columnIndex) => {
                const position = { row: rowIndex, column: columnIndex };
                return (
                  <ScheduleCell
                    activeTarget={
                      activeTarget?.row === rowIndex &&
                      activeTarget.column === columnIndex
                    }
                    key={column.id}
                    labels={words}
                    model={model}
                    movable={!disabled}
                    onFocus={setFocused}
                    onItemPointerDown={drag.onPointerDown}
                    onPress={onPress}
                    position={position}
                    status={cellStatus(
                      model,
                      carry?.itemId ?? null,
                      position,
                      canDrop,
                    )}
                    tabStop={
                      focus.row === rowIndex && focus.column === columnIndex
                    }
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="sw-sr-only" id={instructionsId}>
        {words.instructions}
      </p>
      <div aria-live="polite" className="sw-sr-only" role="status">
        <span key={announcement.id}>{announcement.text}</span>
      </div>
    </div>
  );
}
