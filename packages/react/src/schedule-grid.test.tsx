import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ScheduleGrid,
  type ScheduleGridProps,
} from './components/ScheduleGrid.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const columns = [
  { id: 'otter', label: 'Otter Pool' },
  { id: 'heron', label: 'Heron Marsh' },
];
const rows = [
  { id: '9', label: '9:00' },
  { id: '10', label: '10:30' },
];
const items = [
  {
    id: 'a',
    columnId: 'otter',
    rowId: '9',
    label: 'Otter feeding',
    content: <b>Otters</b>,
  },
  {
    id: 'b',
    columnId: 'heron',
    rowId: '9',
    label: 'Heron count',
    content: <b>Herons</b>,
  },
];

function renderGrid(props: Partial<ScheduleGridProps> = {}) {
  const onMove = vi.fn();
  const onSwap = vi.fn();
  const view = render(
    <ScheduleGrid
      columns={columns}
      disabledCells={[
        { columnId: 'heron', rowId: '10', reason: 'Closed for mowing' },
      ]}
      items={items}
      label="Sunday by enclosure"
      onMove={onMove}
      onSwap={onSwap}
      rows={rows}
      {...props}
    />,
  );
  return { ...view, onMove, onSwap };
}

const cell = (name: string | RegExp) => screen.getByRole('gridcell', { name });
const status = () => screen.getByRole('status');

describe('ScheduleGrid', () => {
  it('is a named grid of headers and cells with one Tab stop', () => {
    renderGrid({
      disabledCells: [
        { columnId: 'heron', rowId: '10', reason: 'Closed for mowing' },
      ],
    });
    const grid = screen.getByRole('grid', { name: 'Sunday by enclosure' });
    expect(grid.style.getPropertyValue('--sw-schedule-grid-columns')).toBe('2');
    expect(grid.getAttribute('aria-describedby')).toBeTruthy();
    expect(
      document.getElementById(grid.getAttribute('aria-describedby')!)!
        .textContent,
    ).toMatch(/^To move an item, press M or Space/);
    expect(
      within(grid)
        .getAllByRole('columnheader')
        .map((h) => h.textContent),
    ).toEqual(['Otter Pool', 'Heron Marsh']);
    expect(
      within(grid)
        .getAllByRole('rowheader')
        .map((h) => h.textContent),
    ).toEqual(['9:00', '10:30']);
    // Without rowsLabel the corner is blank and hidden.
    expect(
      document
        .querySelector('.sw-schedule-grid-corner')!
        .getAttribute('aria-hidden'),
    ).toBe('true');
    expect(within(grid).getAllByRole('gridcell')).toHaveLength(4);
    expect(cell('Otter feeding').tabIndex).toBe(0);
    expect(cell('Heron count').tabIndex).toBe(-1);
    expect(cell('Open').className).toContain('sw-schedule-grid-cell-open');
    expect(cell('Closed for mowing').className).toContain(
      'sw-schedule-grid-cell-disabled',
    );
    expect(cell('Otter feeding').textContent).toBe('Otters');
    // The drawing is hidden: the cell's name says it, once.
    expect(
      cell('Otter feeding')
        .querySelector('.sw-schedule-grid-slot')!
        .getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('ends a carry when its item leaves the grid', () => {
    const props = {
      columns,
      items,
      label: 'Sunday by enclosure',
      onMove: vi.fn(),
      onSwap: vi.fn(),
      rows,
    };
    const { rerender } = render(<ScheduleGrid {...props} />);
    fireEvent.click(cell('Otter feeding'));
    rerender(<ScheduleGrid {...props} items={[items[1]!]} />);
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
    expect(screen.getAllByRole('gridcell', { name: 'Open' })).toHaveLength(3);
    // Coming back, it is not carried again.
    rerender(<ScheduleGrid {...props} />);
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
  });

  it('does not resume a carry after the grid is disabled and enabled again', () => {
    const props = {
      columns,
      disabledCells: [
        { columnId: 'heron', rowId: '10', reason: 'Closed for mowing' },
      ],
      items,
      label: 'Sunday by enclosure',
      onMove: vi.fn(),
      onSwap: vi.fn(),
      rows,
    };
    const { rerender } = render(<ScheduleGrid {...props} />);
    fireEvent.click(cell('Otter feeding'));
    expect(cell(/Moving from here/)).toBeTruthy();
    rerender(<ScheduleGrid {...props} disabled />);
    rerender(<ScheduleGrid {...props} />);
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
  });

  it('heads the rows’ labels with rowsLabel', () => {
    renderGrid({ rowsLabel: 'Time' });
    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual(['Time', 'Otter Pool', 'Heron Marsh']);
  });

  it('names open cells alike: find one by its row', () => {
    renderGrid({ disabledCells: [] });
    const row = screen.getByRole('row', { name: /^10:30/ });
    expect(within(row).getAllByRole('gridcell', { name: 'Open' })).toHaveLength(
      2,
    );
  });

  it('moves focus with the arrows', () => {
    renderGrid();
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(cell('Heron count'));
    expect(cell('Heron count').tabIndex).toBe(0);
    fireEvent.keyDown(cell('Heron count'), { key: 'ArrowDown' });
    // A disabled cell still takes focus, for its reason.
    expect(document.activeElement).toBe(cell('Closed for mowing'));
  });

  it('picks up with M, shows targets as focus moves, and drops with Enter', () => {
    const { onMove } = renderGrid();
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: 'm' });
    expect(status().textContent).toBe(
      'Picked up Otter feeding. Choose a cell with the arrow keys, then press Enter to drop it or Escape to cancel.',
    );
    const source = cell('Otter feeding, Moving from here');
    expect(source.textContent).toBe('OttersMoving from here');
    fireEvent.keyDown(source, { key: 'ArrowDown' });
    const target = cell('Open, Release to move here');
    expect(document.activeElement).toBe(target);
    expect(target.className).toContain('sw-schedule-grid-cell-target');
    expect(target.textContent).toContain('Release to move here');
    fireEvent.keyDown(target, { key: 'Enter' });
    expect(onMove).toHaveBeenCalledWith('a', {
      columnId: 'otter',
      rowId: '10',
    });
    expect(status().textContent).toBe(
      'Moved Otter feeding to 10:30, Otter Pool.',
    );
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
  });

  it('picks up with Space and swaps on another item', () => {
    const { onSwap, onMove } = renderGrid();
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: ' ' });
    fireEvent.keyDown(cell(/Moving from here/), { key: 'ArrowRight' });
    fireEvent.keyDown(cell('Heron count, Release to swap'), { key: ' ' });
    expect(onSwap).toHaveBeenCalledWith('a', 'b');
    expect(onMove).not.toHaveBeenCalled();
    expect(status().textContent).toBe(
      'Swapped Otter feeding with Heron count.',
    );
  });

  it('shows a blocked cell’s reason, refuses the drop, and keeps the item', () => {
    const canDrop = vi.fn((_: string, target: { kind: string }) =>
      target.kind === 'move' ? { reason: 'Otters nap then' } : (true as const),
    );
    const { onMove } = renderGrid({ canDrop });
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: 'M' });
    const blocked = cell('Open, Otters nap then');
    expect(blocked.className).toContain('sw-schedule-grid-cell-blocked');
    expect(blocked.textContent).toBe('OpenOtters nap then');
    fireEvent.keyDown(cell(/Moving from here/), { key: 'ArrowDown' });
    fireEvent.keyDown(blocked, { key: 'Enter' });
    expect(onMove).not.toHaveBeenCalled();
    expect(status().textContent).toBe('Otters nap then');
    expect(cell(/Moving from here/)).toBeTruthy();
  });

  it('cancels with Escape and puts focus back on the item', () => {
    renderGrid();
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: 'm' });
    fireEvent.keyDown(cell(/Moving from here/), { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(status().textContent).toBe(
      'Cancelled. Otter feeding stays where it was.',
    );
    expect(document.activeElement).toBe(cell('Otter feeding'));
  });

  it('refuses a drop on a disabled cell with its reason', () => {
    const { onMove } = renderGrid({
      disabledCells: [
        { columnId: 'heron', rowId: '10', reason: 'Closed for mowing' },
      ],
    });
    fireEvent.click(cell('Otter feeding'));
    // Carrying leaves the disabled cell's look alone.
    expect(cell('Closed for mowing').className).not.toContain(
      'sw-schedule-grid-cell-blocked',
    );
    fireEvent.click(cell('Closed for mowing'));
    expect(onMove).not.toHaveBeenCalled();
    expect(status().textContent).toBe('Closed for mowing');
  });

  it('moves with a press on an item then a press on a cell (touch)', () => {
    const { onMove } = renderGrid();
    fireEvent.click(cell('Heron count'));
    expect(status().textContent).toMatch(/^Picked up Heron count/);
    // No key carry: no target is drawn, only the source.
    expect(document.querySelector('.sw-schedule-grid-cell-target')).toBeNull();
    fireEvent.click(cell('Open, Release to move here'));
    expect(onMove).toHaveBeenCalledWith('b', {
      columnId: 'otter',
      rowId: '10',
    });
  });

  it('cancels a press carry on its own cell or with a press outside', () => {
    const { onMove } = renderGrid();
    fireEvent.click(cell('Heron count'));
    fireEvent.click(cell(/Moving from here/));
    expect(status().textContent).toBe(
      'Cancelled. Heron count stays where it was.',
    );
    fireEvent.click(cell('Heron count'));
    fireEvent.pointerDown(document.body);
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
    expect(onMove).not.toHaveBeenCalled();
  });

  it('drags with a mouse: one hover target, a drop, and no click after it', () => {
    vi.useFakeTimers();
    const { onMove } = renderGrid();
    const target = cell('Open');
    document.elementFromPoint = vi.fn(() => target);
    fireEvent.pointerDown(cell('Otter feeding'), {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      pointerType: 'mouse',
    });
    act(() => {
      window.dispatchEvent(
        new MouseEvent('pointermove', {
          clientX: 12,
          clientY: 11,
        }) as PointerEvent,
      );
    });
    // Under the threshold (and with no pointerId match in jsdom's MouseEvent) nothing starts.
    expect(document.querySelector('.sw-schedule-grid-dragging')).toBeNull();
    const move = new MouseEvent('pointermove', { clientX: 40, clientY: 90 });
    Object.defineProperty(move, 'pointerId', { value: 1 });
    act(() => {
      window.dispatchEvent(move);
    });
    expect(document.querySelector('.sw-schedule-grid-dragging')).not.toBeNull();
    expect(cell('Open, Release to move here').className).toContain(
      'sw-schedule-grid-cell-target',
    );
    expect(cell('Open, Release to move here').textContent).toContain(
      'Release to move here',
    );
    const up = new MouseEvent('pointerup', { clientX: 40, clientY: 90 });
    Object.defineProperty(up, 'pointerId', { value: 1 });
    act(() => {
      window.dispatchEvent(up);
    });
    expect(onMove).toHaveBeenCalledWith('a', {
      columnId: 'otter',
      rowId: '10',
    });
    // The release's click picks nothing up.
    fireEvent.click(cell('Open'));
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
    vi.useRealTimers();
  });

  it('never drags with touch, and picks nothing up while disabled', () => {
    renderGrid({ disabled: true });
    fireEvent.pointerDown(cell('Otter feeding'), {
      pointerType: 'touch',
      button: 0,
    });
    fireEvent.click(cell('Otter feeding'));
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: 'm' });
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
    expect(cell('Otter feeding').className).not.toContain(
      'sw-schedule-grid-cell-movable',
    );
  });

  it('words the pick-up for how it was picked up', () => {
    vi.useFakeTimers();
    renderGrid();
    fireEvent.click(cell('Heron count'));
    expect(status().textContent).toBe(
      'Picked up Heron count. Press a cell to drop it there, or press outside the grid to cancel.',
    );
    fireEvent.pointerDown(document.body);
    document.elementFromPoint = vi.fn(() => cell('Open'));
    fireEvent.pointerDown(cell('Otter feeding'), {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      pointerType: 'mouse',
    });
    const move = new MouseEvent('pointermove', { clientX: 40, clientY: 90 });
    Object.defineProperty(move, 'pointerId', { value: 1 });
    act(() => {
      window.dispatchEvent(move);
    });
    expect(status().textContent).toBe(
      'Picked up Otter feeding. Release it on a cell to drop it there.',
    );
    const up = new MouseEvent('pointercancel');
    Object.defineProperty(up, 'pointerId', { value: 1 });
    act(() => {
      window.dispatchEvent(up);
    });
    vi.useRealTimers();
  });

  it('hands the input to a two-argument pickedUp', () => {
    const pickedUp = vi.fn((item: string, mode: string) => `${item} ${mode}`);
    renderGrid({ labels: { pickedUp } });
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: ' ' });
    expect(status().textContent).toBe('Otter feeding keyboard');
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    fireEvent.click(cell('Heron count'));
    expect(status().textContent).toBe('Heron count tap');
  });

  it('cancels a key carry when focus leaves the grid, not when the window blurs', () => {
    const onMove = vi.fn();
    render(
      <>
        <ScheduleGrid
          columns={columns}
          items={items}
          label="Sunday by enclosure"
          onMove={onMove}
          onSwap={vi.fn()}
          rows={rows}
        />
        <button type="button">After the grid</button>
      </>,
    );
    cell('Otter feeding').focus();
    fireEvent.keyDown(cell('Otter feeding'), { key: 'm' });
    // Moving between cells keeps the carry.
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(cell(/Moving from here/)).toBeTruthy();
    // The window losing focus keeps it.
    vi.spyOn(document, 'hasFocus').mockReturnValue(false);
    fireEvent.blur(document.activeElement!, { relatedTarget: null });
    expect(cell(/Moving from here/)).toBeTruthy();
    vi.mocked(document.hasFocus).mockReturnValue(true);
    act(() => screen.getByRole('button', { name: 'After the grid' }).focus());
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
    expect(status().textContent).toBe(
      'Cancelled. Otter feeding stays where it was.',
    );
    expect(onMove).not.toHaveBeenCalled();
  });

  it('cancels a press carry when focus moves out of the grid', () => {
    render(
      <>
        <ScheduleGrid
          columns={columns}
          items={items}
          label="Sunday by enclosure"
          onMove={vi.fn()}
          onSwap={vi.fn()}
          rows={rows}
        />
        <button type="button">After the grid</button>
      </>,
    );
    cell('Heron count').focus();
    fireEvent.click(cell('Heron count'));
    expect(cell(/Moving from here/)).toBeTruthy();
    act(() => screen.getByRole('button', { name: 'After the grid' }).focus());
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
  });

  it('keeps a press carry through a press on a header, which keeps focus', () => {
    const { onMove } = renderGrid({ rowsLabel: 'Time' });
    cell('Heron count').focus();
    fireEvent.click(cell('Heron count'));
    const header = screen.getByRole('rowheader', { name: '10:30' });
    fireEvent.pointerDown(header);
    // The press's default (moving focus to the body) is held back.
    expect(fireEvent.mouseDown(header)).toBe(false);
    fireEvent.click(header);
    expect(document.activeElement).toBe(cell(/Moving from here/));
    expect(
      fireEvent.mouseDown(screen.getByRole('columnheader', { name: 'Time' })),
    ).toBe(false);
    // A press on a cell still focuses it as usual.
    expect(fireEvent.mouseDown(cell('Open, Release to move here'))).toBe(true);
    fireEvent.click(cell('Open, Release to move here'));
    expect(onMove).toHaveBeenCalledWith('b', {
      columnId: 'otter',
      rowId: '10',
    });
  });

  it('drops a drag whose release comes before the pick-up renders', () => {
    vi.useFakeTimers();
    const { onMove } = renderGrid();
    document.elementFromPoint = vi.fn(() => cell('Open'));
    fireEvent.pointerDown(cell('Otter feeding'), {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      pointerType: 'mouse',
    });
    const move = new MouseEvent('pointermove', { clientX: 40, clientY: 90 });
    Object.defineProperty(move, 'pointerId', { value: 1 });
    const up = new MouseEvent('pointerup', { clientX: 40, clientY: 90 });
    Object.defineProperty(up, 'pointerId', { value: 1 });
    // One act: React commits once, after both events.
    act(() => {
      window.dispatchEvent(move);
      window.dispatchEvent(up);
    });
    expect(onMove).toHaveBeenCalledWith('a', {
      columnId: 'otter',
      rowId: '10',
    });
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
    expect(document.querySelector('.sw-schedule-grid-dragging')).toBeNull();
    vi.useRealTimers();
  });

  it('puts back a drag released outside before the pick-up renders', () => {
    vi.useFakeTimers();
    const { onMove } = renderGrid();
    document.elementFromPoint = vi.fn(() => document.body);
    fireEvent.pointerDown(cell('Otter feeding'), {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      pointerType: 'mouse',
    });
    const move = new MouseEvent('pointermove', { clientX: 400, clientY: 900 });
    Object.defineProperty(move, 'pointerId', { value: 1 });
    const up = new MouseEvent('pointerup', { clientX: 400, clientY: 900 });
    Object.defineProperty(up, 'pointerId', { value: 1 });
    act(() => {
      window.dispatchEvent(move);
      window.dispatchEvent(up);
    });
    expect(onMove).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('gridcell', { name: /Moving from here/ }),
    ).toBeNull();
    expect(document.querySelector('.sw-schedule-grid-dragging')).toBeNull();
    vi.useRealTimers();
  });

  it('takes the consumer’s words', () => {
    renderGrid({
      labels: {
        open: 'Libre',
        pickedUp: (item) => `${item} en mano`,
      },
    });
    expect(cell('Libre')).toBeTruthy();
    fireEvent.click(cell('Otter feeding'));
    expect(status().textContent).toBe('Otter feeding en mano');
  });

  it.each<[string, Partial<ScheduleGridProps>, string]>([
    [
      'a blank rowsLabel',
      { rowsLabel: ' ' },
      'ScheduleGrid rowsLabel must be nonempty when given',
    ],
    ['a blank label', { label: ' ' }, 'ScheduleGrid label must be nonempty'],
    [
      'no columns',
      { columns: [] },
      'ScheduleGrid needs at least one of columns',
    ],
    [
      'a repeated row id',
      { rows: [rows[0]!, { id: '9', label: '9:30' }] },
      'ScheduleGrid rows repeat the id "9"',
    ],
    [
      'a blank column label',
      { columns: [{ id: 'x', label: '' }] },
      'ScheduleGrid columns need nonempty ids and labels',
    ],
    [
      'an item outside the grid',
      { items: [{ ...items[0]!, rowId: '11' }] },
      'ScheduleGrid item "a" is in a column or row it does not have',
    ],
    [
      'two items in one cell',
      { items: [items[0]!, { ...items[1]!, columnId: 'otter' }] },
      'ScheduleGrid holds one item per cell',
    ],
    [
      'a repeated item id',
      { items: [items[0]!, { ...items[1]!, id: 'a' }] },
      'ScheduleGrid items repeat the id "a"',
    ],
    [
      'a disabled cell without a reason',
      { disabledCells: [{ columnId: 'otter', rowId: '10', reason: '' }] },
      'ScheduleGrid disabledCells need a reason',
    ],
    [
      'a disabled cell holding an item',
      { disabledCells: [{ columnId: 'otter', rowId: '9', reason: 'Wet' }] },
      'ScheduleGrid disables a cell that holds an item',
    ],
    [
      'a cell disabled twice',
      {
        disabledCells: [
          { columnId: 'otter', rowId: '10', reason: 'Wet' },
          { columnId: 'otter', rowId: '10', reason: 'Dry' },
        ],
      },
      'ScheduleGrid disables a cell twice',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderGrid(props)).toThrow(new RangeError(message));
  });
});
