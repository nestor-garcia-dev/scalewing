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
import { StatTile } from './components/StatTile.js';
import { TabPanel, Tabs } from './components/Tabs.js';
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

describe('StatTile', () => {
  it('names the figure, tones the value and fills the primary tile', () => {
    render(
      <ThemeProvider colorScheme="light">
        <StatTile
          caption="42 species"
          emphasis="primary"
          glyph={<svg data-testid="glyph" />}
          label="Total sightings"
          value="1,284"
        />
        <StatTile label="Range change" tone="danger" value="-3" />
      </ThemeProvider>,
    );

    const primary = screen.getByText('Total sightings').closest('section');
    expect(primary?.className).toContain('sw-stat-tile');
    expect(primary?.className).toContain('sw-stat-tile-primary');
    expect(screen.getByText('1,284').tagName).toBe('STRONG');
    expect(screen.getByText('1,284').className).toContain('sw-stat-tile-value');
    expect(screen.getByText('1,284').style.color).toBe(
      'var(--sw-color-onAccent)',
    );
    expect(screen.getByText('42 species').className).toContain(
      'sw-stat-tile-caption',
    );
    expect(
      screen.getByTestId('glyph').parentElement?.getAttribute('aria-hidden'),
    ).toBe('true');

    const plain = screen.getByText('Range change').closest('section');
    expect(plain?.className).not.toContain('sw-stat-tile-primary');
    expect(plain?.querySelector('.sw-stat-tile-glyph')).toBeNull();
    expect(screen.getByText('-3').style.color).toBe('var(--sw-color-danger)');
  });
});

describe('Tabs', () => {
  it('exposes a tablist whose panels point at their tabs and hide when not current', () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <Tabs
          aria-label="Habitats"
          id="habitats"
          items={[
            { id: 'forest', label: 'Forest' },
            { id: 'ocean', label: 'Ocean' },
          ]}
          onChange={onChange}
          value="forest"
        />
        <TabPanel id="forest" tabsId="habitats" value="forest">
          Red fox
        </TabPanel>
        <TabPanel id="ocean" tabsId="habitats" value="forest">
          Sea turtle
        </TabPanel>
      </ThemeProvider>,
    );

    const list = screen.getByRole('tablist', { name: 'Habitats' });
    expect(list.className).toContain('sw-tabs');
    const forest = screen.getByRole('tab', { name: 'Forest' });
    const ocean = screen.getByRole('tab', { name: 'Ocean' });
    expect(forest.getAttribute('aria-selected')).toBe('true');
    expect(forest.className).toContain('sw-tab-selected');
    expect(forest.tabIndex).toBe(0);
    expect(ocean.tabIndex).toBe(-1);
    expect(forest.getAttribute('aria-controls')).toBe('habitats-panel-forest');

    const panel = screen.getByRole('tabpanel');
    expect(panel.id).toBe('habitats-panel-forest');
    expect(panel.getAttribute('aria-labelledby')).toBe('habitats-tab-forest');
    expect(panel.textContent).toBe('Red fox');
    expect(screen.getByText('Sea turtle').hidden).toBe(true);

    ocean.click();
    expect(onChange).toHaveBeenCalledWith('ocean');
    forest.click();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('moves and selects with the arrow keys, Home and End', () => {
    const onChange = vi.fn();
    const items = [
      { id: 'forest', label: 'Forest' },
      { id: 'ocean', label: 'Ocean' },
      { id: 'desert', label: 'Desert' },
    ];

    render(
      <ThemeProvider colorScheme="light">
        <Tabs
          aria-label="Habitats"
          id="habitats"
          items={items}
          onChange={onChange}
          value="ocean"
        />
      </ThemeProvider>,
    );

    const list = screen.getByRole('tablist', { name: 'Habitats' });
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('desert');
    fireEvent.keyDown(list, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('forest');
    fireEvent.keyDown(list, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith('forest');
    fireEvent.keyDown(list, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith('desert');
    fireEvent.keyDown(list, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledTimes(4);
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
