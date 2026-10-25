import {
  gridKeyTarget,
  type GridModel,
  type GridPosition,
} from './grid-model.js';

const pickUpKeys = new Set(['m', 'M', ' ']);

/** What a key does in the grid. */
export type GridKeyAction =
  | { type: 'cancel' }
  | { type: 'drop'; position: GridPosition }
  | { type: 'pickUp'; itemId: string }
  | { type: 'focus'; position: GridPosition };

export type GridKey = {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
};

/**
 * The grid's key map: while an item is carried, Escape cancels and Enter
 * or Space drops on the focused cell; otherwise M or Space on an item
 * picks it up (unless the grid is disabled); the navigation keys move
 * focus. Null for any other key.
 */
export function gridKeyAction(
  key: GridKey,
  position: GridPosition,
  context: {
    model: GridModel;
    carrying: boolean;
    disabled: boolean;
    rtl: boolean;
  },
): GridKeyAction | null {
  const { carrying, disabled, model, rtl } = context;
  const plain = !key.ctrlKey && !key.metaKey && !key.altKey;
  if (carrying && key.key === 'Escape') return { type: 'cancel' };
  if (carrying && plain && (key.key === 'Enter' || key.key === ' '))
    return { type: 'drop', position };
  const item = model.itemAt(position);
  if (!carrying && plain && pickUpKeys.has(key.key) && item && !disabled)
    return { type: 'pickUp', itemId: item.id };
  const target = gridKeyTarget(key, position, model, rtl);
  return target === null ? null : { type: 'focus', position: target };
}

/** The cell an event came from, by its data attributes. */
export function cellPositionOf(element: EventTarget): GridPosition | null {
  const cell =
    element instanceof Element
      ? element.closest<HTMLElement>('[data-sw-schedule-cell]')
      : null;
  return cell
    ? { row: Number(cell.dataset.row), column: Number(cell.dataset.column) }
    : null;
}
