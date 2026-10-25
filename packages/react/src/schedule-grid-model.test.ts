import { describe, expect, it } from 'vitest';

import {
  buildGridModel,
  cellName,
  cellStatus,
  gridKeyTarget,
} from './components/schedule-grid/grid-model.js';
import { gridKeyAction } from './components/schedule-grid/grid-keys.js';
import {
  defaultScheduleGridLabels,
  scheduleGridLabels,
} from './components/schedule-grid/labels.js';

const columns = [
  { id: 'otter', label: 'Otter Pool' },
  { id: 'heron', label: 'Heron Marsh' },
];
const rows = [
  { id: '9', label: '9:00' },
  { id: '10', label: '10:30' },
];
const model = buildGridModel({
  columns,
  rows,
  items: [
    {
      id: 'a',
      columnId: 'otter',
      rowId: '9',
      label: 'Otter feeding',
      content: null,
    },
    {
      id: 'b',
      columnId: 'heron',
      rowId: '9',
      label: 'Heron count',
      content: null,
    },
  ],
  disabledCells: [
    { columnId: 'heron', rowId: '10', reason: 'Closed for mowing' },
  ],
});
const size = { rowCount: 2, columnCount: 2 };
const key = (name: string, ctrlKey = false) => ({
  key: name,
  ctrlKey,
  metaKey: false,
});

describe('gridKeyTarget', () => {
  it('moves by one cell with the arrows and stays at the edges', () => {
    const from = { row: 0, column: 0 };
    expect(gridKeyTarget(key('ArrowDown'), from, size, false)).toEqual({
      row: 1,
      column: 0,
    });
    expect(gridKeyTarget(key('ArrowRight'), from, size, false)).toEqual({
      row: 0,
      column: 1,
    });
    expect(gridKeyTarget(key('ArrowUp'), from, size, false)).toEqual(from);
    expect(gridKeyTarget(key('ArrowLeft'), from, size, false)).toEqual(from);
  });

  it('swaps the horizontal arrows in right-to-left', () => {
    expect(
      gridKeyTarget(key('ArrowLeft'), { row: 0, column: 0 }, size, true),
    ).toEqual({
      row: 0,
      column: 1,
    });
  });

  it('goes to the row ends with Home and End, the grid corners with Control', () => {
    const from = { row: 1, column: 1 };
    expect(gridKeyTarget(key('Home'), from, size, false)).toEqual({
      row: 1,
      column: 0,
    });
    expect(gridKeyTarget(key('Home', true), from, size, false)).toEqual({
      row: 0,
      column: 0,
    });
    expect(
      gridKeyTarget(key('End', true), { row: 0, column: 0 }, size, false),
    ).toEqual(from);
    expect(gridKeyTarget(key('Enter'), from, size, false)).toBeNull();
  });
});

describe('cellStatus and cellName', () => {
  const labels = defaultScheduleGridLabels;

  it('is idle with nothing carried and names what the cell holds', () => {
    const status = cellStatus(model, null, { row: 1, column: 0 }, undefined);
    expect(status).toEqual({ kind: 'idle' });
    expect(cellName(model, { row: 1, column: 0 }, status, labels)).toBe('Open');
    expect(cellName(model, { row: 0, column: 0 }, status, labels)).toBe(
      'Otter feeding',
    );
    expect(cellName(model, { row: 1, column: 1 }, status, labels)).toBe(
      'Closed for mowing',
    );
  });

  it('names the source, a move, a swap and a disabled cell while carrying', () => {
    const at = (row: number, column: number) => {
      const status = cellStatus(model, 'a', { row, column }, undefined);
      return cellName(model, { row, column }, status, labels);
    };
    expect(at(0, 0)).toBe('Otter feeding, Moving from here');
    expect(at(1, 0)).toBe('Open, Release to move here');
    expect(at(0, 1)).toBe('Heron count, Release to swap');
    expect(at(1, 1)).toBe('Closed for mowing');
  });

  it('asks canDrop with the target and shows its reason', () => {
    const asked: unknown[] = [];
    const canDrop = (itemId: string, target: unknown) => {
      asked.push([itemId, target]);
      return { reason: 'Otters nap then' };
    };
    const status = cellStatus(model, 'a', { row: 0, column: 1 }, canDrop);
    expect(status).toEqual({ kind: 'blocked', reason: 'Otters nap then' });
    expect(asked).toEqual([
      ['a', { kind: 'swap', itemId: 'b', columnId: 'heron', rowId: '9' }],
    ]);
    expect(cellName(model, { row: 0, column: 1 }, status, labels)).toBe(
      'Heron count, Otters nap then',
    );
    cellStatus(model, 'a', { row: 1, column: 0 }, canDrop);
    expect(asked[1]).toEqual([
      'a',
      { kind: 'move', columnId: 'otter', rowId: '10' },
    ]);
  });

  it('refuses a blank reason from canDrop', () => {
    expect(() =>
      cellStatus(model, 'a', { row: 1, column: 0 }, () => ({ reason: ' ' })),
    ).toThrow(
      new RangeError(
        'ScheduleGrid canDrop must return true or a nonempty reason',
      ),
    );
  });
});

describe('scheduleGridLabels', () => {
  it('keeps the English defaults and takes overrides', () => {
    const words = scheduleGridLabels({ open: 'Libre' });
    expect(words.open).toBe('Libre');
    expect(words.moved('Otter feeding', '10:30', 'Otter Pool')).toBe(
      'Moved Otter feeding to 10:30, Otter Pool.',
    );
    expect(words.swapped('A', 'B')).toBe('Swapped A with B.');
    expect(words.cancelled('A')).toBe('Cancelled. A stays where it was.');
  });

  it('keeps a default for an undefined entry and refuses a message that is not a function', () => {
    expect(scheduleGridLabels({ pickedUp: undefined }).pickedUp('A')).toMatch(
      /^Picked up A\./,
    );
    expect(() => scheduleGridLabels({ moved: 'Moved' as never })).toThrow(
      new RangeError('ScheduleGrid labels.moved must be a function'),
    );
  });

  it('refuses blank words', () => {
    expect(() => scheduleGridLabels({ releaseToSwap: '' })).toThrow(
      new RangeError('ScheduleGrid labels.releaseToSwap must be nonempty'),
    );
  });
});

describe('gridKeyAction', () => {
  const plain = { altKey: false, ctrlKey: false, metaKey: false };
  const at = { row: 0, column: 0 };
  const idle = { model, carrying: false, disabled: false, rtl: false };

  it('picks up an item with M or Space, not an empty cell or a disabled grid', () => {
    expect(gridKeyAction({ ...plain, key: 'm' }, at, idle)).toEqual({
      type: 'pickUp',
      itemId: 'a',
    });
    expect(gridKeyAction({ ...plain, key: ' ' }, at, idle)).toEqual({
      type: 'pickUp',
      itemId: 'a',
    });
    expect(
      gridKeyAction({ ...plain, key: 'm' }, { row: 1, column: 0 }, idle),
    ).toBeNull();
    expect(
      gridKeyAction({ ...plain, key: 'm' }, at, { ...idle, disabled: true }),
    ).toBeNull();
    expect(
      gridKeyAction({ ...plain, ctrlKey: true, key: 'm' }, at, idle),
    ).toBeNull();
  });

  it('drops with Enter or Space and cancels with Escape while carrying', () => {
    const carrying = { ...idle, carrying: true };
    expect(gridKeyAction({ ...plain, key: 'Enter' }, at, carrying)).toEqual({
      type: 'drop',
      position: at,
    });
    expect(gridKeyAction({ ...plain, key: ' ' }, at, carrying)).toEqual({
      type: 'drop',
      position: at,
    });
    expect(gridKeyAction({ ...plain, key: 'Escape' }, at, carrying)).toEqual({
      type: 'cancel',
    });
    expect(gridKeyAction({ ...plain, key: 'Escape' }, at, idle)).toBeNull();
  });

  it('moves focus with the navigation keys', () => {
    expect(gridKeyAction({ ...plain, key: 'ArrowDown' }, at, idle)).toEqual({
      type: 'focus',
      position: { row: 1, column: 0 },
    });
  });
});
