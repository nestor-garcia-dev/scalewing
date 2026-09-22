import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Badge } from './components/Badge.js';
import { SegmentedControl } from './components/SegmentedControl.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from './components/Table.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => {
  cleanup();
});

describe('Badge', () => {
  it('renders a non-interactive span with tone classes', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Badge tone="accent">QB</Badge>
      </ThemeProvider>,
    );

    const badge = screen.getByText('QB');
    expect(badge.tagName).toBe('SPAN');
    expect(badge.className).toContain('sw-badge');
    expect(badge.className).toContain('sw-badge-accent');
    expect(badge.className).toContain('sw-badge-md');
  });

  it('paints the warning tone from its own colour token', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Badge tone="warning">Nesting</Badge>
      </ThemeProvider>,
    );

    expect(screen.getByText('Nesting').className).toContain('sw-badge-warning');
  });

  it('maps compact chicklets to the sm size class', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Badge size="sm">Workhorse</Badge>
      </ThemeProvider>,
    );

    expect(screen.getByText('Workhorse').className).toContain('sw-badge-sm');
  });
});

describe('SegmentedControl', () => {
  it('exposes a radiogroup and reports the selected value', () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <SegmentedControl
          aria-label="Board mode"
          items={[
            { id: 'prep', label: 'Prep' },
            { id: 'draft', label: 'Draft' },
          ]}
          onChange={onChange}
          value="prep"
        />
      </ThemeProvider>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Board mode' });
    expect(group.className).toContain('sw-segmented');

    const prep = screen.getByRole('radio', { name: 'Prep' });
    const draft = screen.getByRole('radio', { name: 'Draft' });
    expect(prep.getAttribute('aria-checked')).toBe('true');
    expect(draft.getAttribute('aria-checked')).toBe('false');
    expect(prep.className).toContain('sw-segmented-item-selected');

    draft.click();
    expect(onChange).toHaveBeenCalledWith('draft');
  });

  it('stretches and fills the selected segment at the filled variant', () => {
    render(
      <ThemeProvider colorScheme="light">
        <SegmentedControl
          aria-label="Direction"
          items={[
            { id: 'remove', label: 'Remove' },
            { id: 'add', label: 'Add' },
          ]}
          onChange={() => {}}
          value="remove"
          variant="filled"
        />
      </ThemeProvider>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Direction' });
    expect(group.className).toBe('sw-segmented sw-segmented-filled');
    expect(screen.getByRole('radio', { name: 'Remove' }).className).toContain(
      'sw-segmented-item-selected',
    );
  });

  it('keeps the choice visible but inert when disabled', () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <SegmentedControl
          aria-label="Payment"
          disabled
          items={[
            { id: 'cash', label: 'Cash' },
            { id: 'card', label: 'Card' },
          ]}
          onChange={onChange}
          value="cash"
          variant="filled"
        />
        <SegmentedControl
          aria-label="Habitat"
          disabled
          items={[
            { id: 'reef', label: 'Reef' },
            { id: 'kelp', label: 'Kelp' },
          ]}
          value="reef"
        />
      </ThemeProvider>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Payment' });
    expect(group.className).toBe(
      'sw-segmented sw-segmented-filled sw-segmented-disabled',
    );
    expect(group.getAttribute('aria-disabled')).toBe('true');
    const cash = screen.getByRole('radio', { name: 'Cash' });
    const card = screen.getByRole('radio', { name: 'Card' });
    expect(cash.getAttribute('aria-checked')).toBe('true');
    expect((card as HTMLButtonElement).disabled).toBe(true);

    card.click();
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();

    // A disabled control needs no onChange at all.
    const habitat = screen.getByRole('radiogroup', { name: 'Habitat' });
    screen.getByRole('radio', { name: 'Kelp' }).click();
    fireEvent.keyDown(habitat, { key: 'ArrowRight' });
    expect(
      screen.getByRole('radio', { name: 'Reef' }).getAttribute('aria-checked'),
    ).toBe('true');
  });
});

describe('Table', () => {
  it('renders a sticky numeric table from compound parts', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Table aria-label="Scoring">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Player</TableCell>
              <TableCell as="th" numeric>
                ADP
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell truncate>Sunday long why line</TableCell>
              <TableCell numeric>12.4</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ThemeProvider>,
    );

    const table = screen.getByRole('table', { name: 'Scoring' });
    expect(table.className).toContain('sw-table');
    expect(table.className).toContain('sw-table-sticky');
    expect(
      screen.getByRole('columnheader', { name: 'ADP' }).className,
    ).toContain('sw-table-numeric');
    expect(screen.getByRole('cell', { name: '12.4' }).className).toContain(
      'sw-table-numeric',
    );
    expect(
      screen.getByRole('cell', { name: 'Sunday long why line' }).className,
    ).toContain('sw-table-clip');
  });

  it('opts into compact density and a selected row marker', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Table aria-label="Round" density="compact">
          <TableBody>
            <TableRow selected>
              <TableCell>Best</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ThemeProvider>,
    );

    const table = screen.getByRole('table', { name: 'Round' });
    expect(table.className).toContain('sw-table-compact');
    const row = within(table).getByRole('row');
    expect(row.getAttribute('aria-selected')).toBe('true');
    expect(row.className).toContain('sw-table-row-selected');
  });
});
