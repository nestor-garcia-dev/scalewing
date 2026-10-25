import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Box } from './components/Box.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  type TableSort,
} from './components/Table.js';
import { rowPressAction } from './components/table/row-press.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  document.getSelection()?.removeAllRanges();
});

function renderTable(rows: ReactNode) {
  render(
    <Table aria-label="Sightings">
      <TableHeader>
        <TableRow>
          <TableCell as="th">Species</TableCell>
          <TableCell as="th">Habitat</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>,
  );
}

/** The heron row: a picked name, a habitat cell and an optional extra. */
function heronRow(
  onPick: () => void,
  extra: ReactNode = null,
  props: { pressable?: boolean; onClick?: () => void } = { pressable: true },
) {
  return (
    <TableRow {...props}>
      <TableCell onPress={onPick}>Grey heron</TableCell>
      <TableCell>
        <span>Wetland</span>
        {extra}
      </TableCell>
    </TableRow>
  );
}

function habitat(): HTMLElement {
  return screen.getByText('Wetland');
}

describe('TableCell onPress', () => {
  it('makes the cell a button named by its text, which calls onPress', () => {
    const onPick = vi.fn();
    renderTable(heronRow(onPick));
    const button = screen.getByRole('button', { name: 'Grey heron' });
    expect(button.className).toBe('sw-table-action');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.parentElement?.tagName).toBe('TD');
    fireEvent.click(button);
    expect(onPick).toHaveBeenCalledTimes(1);
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('works on a row header', () => {
    const onPick = vi.fn();
    renderTable(
      <TableRow pressable>
        <TableCell as="th" scope="row" onPress={onPick}>
          Grey heron
        </TableCell>
        <TableCell>Wetland</TableCell>
      </TableRow>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Grey heron' }));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('rowheader', { name: 'Grey heron' }).firstElementChild
        ?.className,
    ).toBe('sw-table-action');
  });

  it('leaves a cell without onPress as its text', () => {
    renderTable(
      <TableRow>
        <TableCell>Grey heron</TableCell>
        <TableCell>Wetland</TableCell>
      </TableRow>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('throws for a press that is not a function, or on a sortable header', () => {
    expect(() =>
      renderTable(
        <TableRow>
          <TableCell onPress={'pick' as unknown as () => void}>Heron</TableCell>
        </TableRow>,
      ),
    ).toThrow(new TypeError('TableCell onPress is a function'));
    expect(() =>
      render(
        <table>
          <thead>
            <tr>
              <TableCell
                as="th"
                onPress={() => undefined}
                onSort={() => undefined}
                sort={'none' as TableSort}
              >
                Species
              </TableCell>
            </tr>
          </thead>
        </table>,
      ),
    ).toThrow(new TypeError('TableCell onPress is not for a sortable header'));
  });
});

describe('TableRow pressable', () => {
  it('marks the row with its generated class, before a consumer class, and adds no role or tab stop', () => {
    renderTable(
      <TableRow className="result" pressable>
        <TableCell onPress={() => undefined}>Grey heron</TableCell>
      </TableRow>,
    );
    const row = screen.getAllByRole('row')[1]!;
    expect(row.className).toBe('sw-table-row-press result');
    expect(row.hasAttribute('tabindex')).toBe(false);
    expect(row.getAttribute('role')).toBeNull();
  });

  it('keeps a row plain by default', () => {
    const onPick = vi.fn();
    renderTable(heronRow(onPick, null, {}));
    const row = screen.getAllByRole('row')[1]!;
    expect(row.className).toBe('');
    fireEvent.click(habitat());
    expect(onPick).not.toHaveBeenCalled();
  });

  it('activates its action from a press anywhere else on the row, once', () => {
    const onPick = vi.fn();
    renderTable(heronRow(onPick));
    fireEvent.click(habitat());
    expect(onPick).toHaveBeenCalledTimes(1);
    fireEvent.click(habitat().closest('td')!);
    expect(onPick).toHaveBeenCalledTimes(2);
    // A press on the action itself is the action's own, not a second one.
    fireEvent.click(screen.getByRole('button', { name: 'Grey heron' }));
    expect(onPick).toHaveBeenCalledTimes(3);
  });

  it('follows a link that is the row’s action', () => {
    const onOpen = vi.fn((event: MouseEvent) => event.preventDefault());
    renderTable(
      <TableRow pressable>
        <TableCell>
          <Box as="a" href="#heron" link="quiet" onClick={onOpen}>
            Grey heron
          </Box>
        </TableCell>
        <TableCell>Wetland</TableCell>
      </TableRow>,
    );
    fireEvent.click(habitat());
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls a consumer onClick too', () => {
    const onPick = vi.fn();
    const onClick = vi.fn();
    renderTable(heronRow(onPick, null, { pressable: true, onClick }));
    fireEvent.click(habitat());
    expect(onPick).toHaveBeenCalledTimes(1);
    // Once: not again for the click the row hands its action.
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls a consumer onClick on a row that is not pressable', () => {
    const onPick = vi.fn();
    const onClick = vi.fn();
    renderTable(heronRow(onPick, null, { onClick }));
    fireEvent.click(habitat());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onPick).not.toHaveBeenCalled();
  });

  it.each([
    ['a modifier key', { metaKey: true }],
    ['ctrl', { ctrlKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['a secondary button', { button: 1 }],
  ])('leaves a press with %s alone', (_name, init) => {
    const onPick = vi.fn();
    renderTable(heronRow(onPick));
    fireEvent.click(habitat(), init);
    expect(onPick).not.toHaveBeenCalled();
  });

  it('leaves a press on another control in the row to that control', () => {
    const onPick = vi.fn();
    const onOther = vi.fn();
    renderTable(
      heronRow(
        onPick,
        <>
          <input aria-label="Note" />
          <span role="button" tabIndex={0} onClick={onOther}>
            More
          </span>
          <span tabIndex={0}>Focusable</span>
        </>,
      ),
    );
    fireEvent.click(screen.getByRole('textbox', { name: 'Note' }));
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByText('Focusable'));
    expect(onOther).toHaveBeenCalledTimes(1);
    expect(onPick).not.toHaveBeenCalled();
  });

  it('leaves a press that a handler inside already took', () => {
    const onPick = vi.fn();
    renderTable(
      heronRow(
        onPick,
        <span onClick={(event) => event.preventDefault()}>Handled</span>,
      ),
    );
    fireEvent.click(screen.getByText('Handled'));
    expect(onPick).not.toHaveBeenCalled();
  });

  it('leaves a press that ends a text selection in the row', () => {
    const onPick = vi.fn();
    renderTable(heronRow(onPick));
    const range = document.createRange();
    range.selectNodeContents(habitat());
    document.getSelection()!.addRange(range);
    fireEvent.click(habitat());
    expect(onPick).not.toHaveBeenCalled();
    // A selection elsewhere on the page does not stop it.
    document.getSelection()!.removeAllRanges();
    const outside = document.createElement('p');
    outside.textContent = 'Elsewhere';
    document.body.append(outside);
    const away = document.createRange();
    away.selectNodeContents(outside);
    document.getSelection()!.addRange(away);
    fireEvent.click(habitat());
    expect(onPick).toHaveBeenCalledTimes(1);
    outside.remove();
  });

  it('does nothing while its action is disabled', () => {
    const onOpen = vi.fn();
    renderTable(
      <>
        <TableRow pressable>
          <TableCell>
            <button disabled onClick={onOpen} type="button">
              Grey heron
            </button>
          </TableCell>
          <TableCell>Wetland</TableCell>
        </TableRow>
        <TableRow pressable>
          <TableCell>
            <button aria-disabled="true" onClick={onOpen} type="button">
              River otter
            </button>
          </TableCell>
          <TableCell>River</TableCell>
        </TableRow>
      </>,
    );
    fireEvent.click(habitat());
    fireEvent.click(screen.getByText('River'));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('does nothing in a row without an action', () => {
    renderTable(
      <TableRow pressable>
        <TableCell>Grey heron</TableCell>
        <TableCell>Wetland</TableCell>
      </TableRow>,
    );
    expect(() => fireEvent.click(habitat())).not.toThrow();
  });
});

describe('rowPressAction', () => {
  const press = {
    button: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    defaultPrevented: false,
  };

  function row(): HTMLTableRowElement {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td><a href="#a">A</a></td><td><span>B</span></td>';
    document.body.append(tr);
    return tr;
  }

  it('answers the row’s first link for a press on its text', () => {
    const tr = row();
    expect(
      rowPressAction(tr, { ...press, target: tr.querySelector('span') }),
    ).toBe(tr.querySelector('a'));
    tr.remove();
  });

  it('answers none for a target outside the row, or not an element', () => {
    const tr = row();
    expect(rowPressAction(tr, { ...press, target: document.body })).toBeNull();
    expect(rowPressAction(tr, { ...press, target: null })).toBeNull();
    expect(
      rowPressAction(tr, {
        ...press,
        target: tr.querySelector('span')!.firstChild,
      }),
    ).toBeNull();
    tr.remove();
  });

  it('answers the action for a press on a row that is itself focusable', () => {
    const tr = row();
    tr.tabIndex = 0;
    expect(
      rowPressAction(tr, { ...press, target: tr.querySelector('span') }),
    ).toBe(tr.querySelector('a'));
    tr.remove();
  });
});

describe('pressable row styles', () => {
  it('lists its generated classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-table-row-press', 'sw-table-action']),
    );
  });

  it('generates the pointer, the quiet fill on hover, press and keyboard focus, and the forced-colours outline', () => {
    const css = generateStylesheet();
    expect(css).toContain(`.sw-table-row-press {
  cursor: pointer;
}`);
    expect(css).toContain(`@media (hover: hover) {
  .sw-table-row-press:hover > :is(td, th) {
    background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
  }

  .sw-table-row-press:hover .sw-table-action {
    text-decoration-line: underline;
  }
`);
    // On the fill, muted cells and muted words in the cells read as text.
    expect(css).toContain(`.sw-table-row-press:hover > :is(td, th) * {
  --sw-color-muted: var(--sw-color-text);
}`);
    expect(css).toContain(`.sw-table-row-press:hover > .sw-table-tone-muted {
  color: var(--sw-color-text);
}`);
    expect(css).toContain(`.sw-table-row-press:active > :is(td, th),
.sw-table-row-press:has(:focus-visible) > :is(td, th) {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
}`);
    expect(css).toContain(`  .sw-table-row-press:hover,
  .sw-table-row-press:has(:focus-visible) {
    outline: var(--sw-focus-ring-width) solid Highlight;`);
  });

  it('generates the action in the cell’s text at 600, underlined and ringed on focus', () => {
    const css = generateStylesheet();
    expect(css).toContain(`.sw-table-action {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-sm);
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 600;`);
    expect(css).toContain(`.sw-table-action:hover,
.sw-table-action:focus-visible {
  text-decoration-line: underline;
}`);
    expect(css).toContain(`.sw-table-action:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);`);
    expect(css).toContain('.sw-table-action { color: ButtonText; }');
  });
});
