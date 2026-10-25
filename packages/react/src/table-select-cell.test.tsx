import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableSelectCell,
} from './components/Table.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const css = generateStylesheet();

function Birds({ onRow = () => {} }: { onRow?: (next: boolean) => void }) {
  return (
    <Table aria-label="Birds">
      <TableHeader>
        <TableRow>
          <TableSelectCell
            as="th"
            checked={false}
            indeterminate
            label="Select all"
            onCheckedChange={() => {}}
          />
          <TableCell as="th">Bird</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected>
          <TableSelectCell
            checked
            label="Select Mallard"
            onCheckedChange={onRow}
          />
          <TableCell>Mallard</TableCell>
        </TableRow>
        <TableRow>
          <TableSelectCell
            checked={false}
            disabled
            label="Select Teal"
            onCheckedChange={onRow}
          />
          <TableCell>Teal</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('TableSelectCell', () => {
  it('is a header cell with a mixed Select all and body cells with named boxes', () => {
    render(<Birds />);
    const table = screen.getByRole('table', { name: 'Birds' });
    const header = within(table).getByRole('columnheader', {
      name: 'Select all',
    });
    expect(header.tagName).toBe('TH');
    expect(header.getAttribute('scope')).toBe('col');
    expect(header.className).toBe('sw-table-select');
    const all = within(header).getByRole<HTMLInputElement>('checkbox');
    expect(all.indeterminate).toBe(true);
    expect(all.getAttribute('aria-checked')).toBe('mixed');

    const mallard = screen.getByRole<HTMLInputElement>('checkbox', {
      name: 'Select Mallard',
    });
    expect(mallard.checked).toBe(true);
    const cell = mallard.closest('td')!;
    expect(cell.className).toBe('sw-table-select');
    expect(cell.hasAttribute('scope')).toBe(false);
    expect(cell.querySelector('.sw-checkbox-label-hidden')).not.toBeNull();
    expect(
      screen.getByRole<HTMLInputElement>('checkbox', { name: 'Select Teal' })
        .disabled,
    ).toBe(true);
  });

  it('reports a press with the next state', async () => {
    const onRow = vi.fn();
    render(<Birds onRow={onRow} />);
    await userEvent
      .setup()
      .click(screen.getByRole('checkbox', { name: 'Select Mallard' }));
    expect(onRow).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('is left alone by a pressable row: a press on the box toggles it, not the row action', async () => {
    const onPick = vi.fn();
    const onRow = vi.fn();
    render(
      <Table aria-label="Birds">
        <TableBody>
          <TableRow pressable>
            <TableSelectCell
              checked={false}
              label="Select Mallard"
              onCheckedChange={onRow}
            />
            <TableCell onPress={onPick}>Mallard</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('checkbox', { name: 'Select Mallard' }));
    expect(onRow).toHaveBeenCalledExactlyOnceWith(true);
    expect(onPick).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Mallard' }));
    expect(onPick).toHaveBeenCalledTimes(1);
  });

  it('throws on a blank label or an unknown element', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const cell = (label: string, as?: 'td' | 'th') => (
      <table>
        <tbody>
          <tr>
            <TableSelectCell
              as={as}
              checked={false}
              label={label}
              onCheckedChange={() => {}}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(() => render(cell(' '))).toThrow(RangeError);
    expect(() => render(cell('Select', 'div' as 'td'))).toThrow(RangeError);
  });

  it('is as narrow as the box, and the 44 px target wide on a coarse pointer', () => {
    expect(css).toContain(
      '.sw-table .sw-table-select {\n  width: var(--sw-space-5);\n}',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-table .sw-table-select { width: var(--sw-control-md-min-height); }\n}',
    );
    expect(utilityClassCatalog()).toContain('sw-table-select');
  });
});
