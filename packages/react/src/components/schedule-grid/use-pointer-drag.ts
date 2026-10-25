import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import { type GridPosition } from './grid-model.js';

/** How far a mouse or pen moves before a press becomes a drag, in CSS pixels. */
export const dragThreshold = 4;

type DragHandlers = {
  onStart: (itemId: string) => void;
  onHover: (position: GridPosition | null) => void;
  /** Where the drag ended: a cell, or null outside the grid or when cancelled. */
  onDrop: (position: GridPosition | null) => void;
};

type Press = {
  itemId: string;
  pointerId: number;
  x: number;
  y: number;
  dragging: boolean;
};

/** The grid cell under a point, or null outside `container`. */
function positionAt(
  container: HTMLElement | null,
  x: number,
  y: number,
): GridPosition | null {
  const cell = document
    .elementFromPoint(x, y)
    ?.closest<HTMLElement>('[data-sw-schedule-cell]');
  if (!cell || !container?.contains(cell)) return null;
  return { row: Number(cell.dataset.row), column: Number(cell.dataset.column) };
}

/**
 * A mouse or pen drag of an item between cells: a press that moves past
 * `dragThreshold` starts it, the cell under the pointer is its one hover
 * target, and the release drops it. Touch never drags (a page scrolls
 * under a finger); presses then go through the click path. The click a
 * drag's release makes is swallowed (`consumeClick`).
 */
export function usePointerDrag(
  container: RefObject<HTMLElement | null>,
  enabled: boolean,
  handlers: DragHandlers,
) {
  const latest = useRef(handlers);
  useLayoutEffect(() => {
    latest.current = handlers;
  });
  const stop = useRef<(() => void) | null>(null);
  const swallowClick = useRef(false);

  useEffect(() => () => stop.current?.(), []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, itemId: string) => {
      if (!enabled || event.button !== 0 || event.pointerType === 'touch')
        return;
      stop.current?.();
      const press: Press = {
        itemId,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        dragging: false,
      };
      const move = (moved: PointerEvent) => {
        if (moved.pointerId !== press.pointerId) return;
        if (!press.dragging) {
          const distance = Math.hypot(
            moved.clientX - press.x,
            moved.clientY - press.y,
          );
          if (distance < dragThreshold) return;
          press.dragging = true;
          latest.current.onStart(press.itemId);
        }
        moved.preventDefault();
        latest.current.onHover(
          positionAt(container.current, moved.clientX, moved.clientY),
        );
      };
      const end = (ended: PointerEvent) => {
        if (ended.pointerId !== press.pointerId) return;
        stop.current?.();
        if (!press.dragging) return;
        swallowClick.current = true;
        setTimeout(() => {
          swallowClick.current = false;
        }, 0);
        latest.current.onDrop(
          ended.type === 'pointerup'
            ? positionAt(container.current, ended.clientX, ended.clientY)
            : null,
        );
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
      stop.current = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', end);
        window.removeEventListener('pointercancel', end);
        stop.current = null;
      };
    },
    [container, enabled],
  );

  /** True once for the click that ends a drag, which must not pick up or drop. */
  const consumeClick = useCallback(() => {
    if (!swallowClick.current) return false;
    swallowClick.current = false;
    return true;
  }, []);

  return { consumeClick, onPointerDown };
}
