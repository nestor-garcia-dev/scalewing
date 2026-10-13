import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionMenu } from './components/ActionMenu.js';
import { Box } from './components/Box.js';
import { Button } from './components/Button.js';
import { CalendarButton } from './components/CalendarButton.js';
import { Checkbox } from './components/Checkbox.js';
import { CheckboxControl } from './components/checkbox/CheckboxControl.js';
import { DateField } from './components/DateField.js';
import { Field } from './components/Field.js';
import { FilterChips } from './components/FilterChips.js';
import { InfoTip } from './components/InfoTip.js';
import { MultiSelect } from './components/MultiSelect.js';
import { RadioGroup } from './components/RadioGroup.js';
import { SectionNav } from './components/SectionNav.js';
import { SegmentedControl } from './components/SegmentedControl.js';
import { Select } from './components/Select.js';
import { Stepper } from './components/Stepper.js';
import { Switch } from './components/Switch.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from './components/Table.js';
import { radioTabStopValue, tabStop } from './tab-stop.js';

afterEach(() => cleanup());

/** The explicit attribute, not the IDL default every button already reports. */
function tabindexOf(element: Element) {
  return element.getAttribute('tabindex');
}

const habitats = [
  { value: 'forest', label: 'Forest' },
  { value: 'lake', label: 'Lake' },
  { value: 'reef', label: 'Reef' },
];

describe('tabStop (Safari reaches every press control with Tab)', () => {
  it('is an explicit zero', () => {
    expect(tabStop).toBe(0);
  });

  it('puts an explicit tabindex on a Button, and a consumer value wins', () => {
    render(
      <>
        <Button onPress={() => undefined}>Save</Button>
        <Button onPress={() => undefined} tabIndex={-1}>
          Skip
        </Button>
        <Button disabled onPress={() => undefined}>
          Later
        </Button>
        <Button onPress={() => undefined} tabIndex={undefined}>
          Unset
        </Button>
      </>,
    );
    expect(tabindexOf(screen.getByRole('button', { name: 'Save' }))).toBe('0');
    expect(tabindexOf(screen.getByRole('button', { name: 'Skip' }))).toBe('-1');
    const later = screen.getByRole('button', { name: 'Later' });
    // A disabled button stays out of the order whatever its tabindex.
    expect((later as HTMLButtonElement).disabled).toBe(true);
    expect(tabindexOf(later)).toBe('0');
    // An undefined tabIndex is no value: the default stays.
    expect(tabindexOf(screen.getByRole('button', { name: 'Unset' }))).toBe('0');
  });

  it('reaches the Buttons other controls are built on', () => {
    render(
      <>
        <CalendarButton
          label="Sighting day"
          onChange={() => undefined}
          value="2024-03-10"
        />
        <InfoTip content="Counted at dawn" label="About sightings">
          <svg />
        </InfoTip>
      </>,
    );
    for (const button of screen.getAllByRole('button')) {
      expect(tabindexOf(button)).toBe('0');
    }
  });

  it('makes a Box link with a destination a tab stop, and nothing else', () => {
    render(
      <>
        <Box as="a" href="#forest">
          Forest
        </Box>
        <Box as="a" href="#lake" tabIndex={-1}>
          Lake
        </Box>
        <Box as="a" data-testid="bare">
          Reef
        </Box>
        <Box data-testid="plain">Plain</Box>
      </>,
    );
    expect(tabindexOf(screen.getByRole('link', { name: 'Forest' }))).toBe('0');
    expect(tabindexOf(screen.getByRole('link', { name: 'Lake' }))).toBe('-1');
    expect(tabindexOf(screen.getByTestId('bare'))).toBeNull();
    expect(tabindexOf(screen.getByTestId('plain'))).toBeNull();
  });

  it('marks SectionNav links, a Select, MultiSelect and ActionMenu trigger', () => {
    render(
      <>
        <SectionNav
          aria-label="Areas"
          items={[{ id: 'north', label: 'North', href: '/north' }]}
        />
        <Select
          label="Habitat"
          onChange={() => undefined}
          options={habitats}
          value="forest"
        />
        <MultiSelect
          allLabel="All"
          clearLabel="Clear"
          label="Show"
          onChange={() => undefined}
          options={habitats}
          summary="All"
          value={['forest']}
        />
        <ActionMenu
          items={[{ id: 'share', label: 'Share', onSelect: () => undefined }]}
          label="Sighting actions"
        />
      </>,
    );
    expect(tabindexOf(screen.getByRole('link', { name: 'North' }))).toBe('0');
    expect(tabindexOf(screen.getByRole('combobox', { name: 'Habitat' }))).toBe(
      '0',
    );
    const show = screen.getByRole('button', { name: /^Show/ });
    expect(tabindexOf(show)).toBe('0');
    expect(
      tabindexOf(screen.getByRole('button', { name: 'Sighting actions' })),
    ).toBe('0');
    fireEvent.click(show);
    for (const box of screen.getAllByRole('checkbox')) {
      expect(tabindexOf(box)).toBe('0');
    }
  });

  it('marks every SegmentedControl item, a Switch and a Checkbox', () => {
    render(
      <>
        <SegmentedControl
          aria-label="Direction"
          items={[
            { id: 'north', label: 'North' },
            { id: 'south', label: 'South' },
          ]}
          onChange={() => undefined}
          value="north"
        />
        <Switch checked={false} label="Active" onCheckedChange={vi.fn()} />
        <Checkbox checked label="Confirmed" onCheckedChange={vi.fn()} />
      </>,
    );
    for (const item of screen.getAllByRole('radio')) {
      expect(tabindexOf(item)).toBe('0');
    }
    expect(tabindexOf(screen.getByRole('switch', { name: 'Active' }))).toBe(
      '0',
    );
    expect(
      tabindexOf(screen.getByRole('checkbox', { name: 'Confirmed' })),
    ).toBe('0');
  });

  it('marks the date button, its month steps, a search clear and table presses', () => {
    render(
      <>
        <DateField
          label="Sighting date"
          onChange={() => undefined}
          value="2024-03-10"
        />
        <Field
          clearLabel="Clear search"
          label="Search birds"
          onClear={() => undefined}
          variant="search"
        >
          <input onChange={() => undefined} value="heron" />
        </Field>
        <Table aria-label="Sightings">
          <TableHeader>
            <TableRow>
              <TableCell as="th" onSort={() => undefined} sort="none">
                Date
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell onPress={() => undefined}>Heron</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    );
    expect(tabindexOf(screen.getByRole('button', { name: 'Date' }))).toBe('0');
    expect(tabindexOf(screen.getByRole('button', { name: 'Heron' }))).toBe('0');
    expect(
      tabindexOf(screen.getByRole('button', { name: 'Clear search' })),
    ).toBe('0');
    const choose = screen.getByRole('button', { name: /choose date/i });
    expect(tabindexOf(choose)).toBe('0');
    fireEvent.click(choose);
    for (const step of screen.getAllByRole('button', {
      name: /previous month|next month/i,
    })) {
      expect(tabindexOf(step)).toBe('0');
    }
  });

  it('lets a checkbox control take a tabIndex, keeping the default for undefined', () => {
    render(
      <>
        <CheckboxControl aria-label="Unset" tabIndex={undefined} />
        <CheckboxControl aria-label="Skipped" tabIndex={-1} />
      </>,
    );
    expect(tabindexOf(screen.getByRole('checkbox', { name: 'Unset' }))).toBe(
      '0',
    );
    expect(tabindexOf(screen.getByRole('checkbox', { name: 'Skipped' }))).toBe(
      '-1',
    );
  });

  it("keeps a Stepper's − and + out of the order, its count the one stop", () => {
    render(
      <Stepper
        decrementLabel="One less"
        incrementLabel="One more"
        label="Herons"
        onChange={() => undefined}
        value={2}
      />,
    );
    expect(tabindexOf(screen.getByRole('button', { name: 'One less' }))).toBe(
      '-1',
    );
    expect(tabindexOf(screen.getByRole('button', { name: 'One more' }))).toBe(
      '-1',
    );
  });
});

describe('radioTabStopValue', () => {
  it('picks the checked option, else the first enabled one', () => {
    expect(radioTabStopValue(habitats, 'lake')).toBe('lake');
    expect(radioTabStopValue(habitats, '')).toBe('forest');
    expect(radioTabStopValue(habitats, undefined)).toBe('forest');
    expect(
      radioTabStopValue(
        [{ value: 'forest', disabled: true }, { value: 'lake' }],
        '',
      ),
    ).toBe('lake');
    expect(
      radioTabStopValue(
        [{ value: 'forest', disabled: true }, { value: 'lake' }],
        'forest',
      ),
    ).toBe('lake');
    expect(radioTabStopValue([{ value: 'forest', disabled: true }], '')).toBe(
      undefined,
    );
  });

  it('gives one radio of a RadioGroup and of FilterChips the tab stop', () => {
    const { rerender } = render(
      <>
        <RadioGroup
          legend="Habitat"
          onChange={() => undefined}
          options={habitats}
          value="lake"
        />
        <FilterChips
          label="Filter"
          onChange={() => undefined}
          options={habitats}
          value=""
        />
      </>,
    );
    const stops = () =>
      screen.getAllByRole('radio').map((radio) => tabindexOf(radio));
    expect(stops()).toEqual([null, '0', null, '0', null, null]);
    rerender(
      <>
        <RadioGroup
          legend="Habitat"
          onChange={() => undefined}
          options={habitats}
          value=""
        />
        <FilterChips
          label="Filter"
          onChange={() => undefined}
          options={habitats}
          value="reef"
        />
      </>,
    );
    expect(stops()).toEqual(['0', null, null, null, null, '0']);
  });
});
