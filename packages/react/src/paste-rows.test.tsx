import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PasteRows } from './components/PasteRows.js';
import { parsePastedRows } from './components/paste-rows/parse-pasted-rows.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const columns = [
  { id: 'bird', label: 'Bird' },
  { id: 'habitat', label: 'Habitat' },
  { id: 'skip', label: 'Don’t use' },
];

const countLabel = (count: number) =>
  count === 1 ? 'Found 1 column' : `Found ${count} columns`;

function Sightings({
  initial = '',
  onMapping,
}: {
  initial?: string;
  onMapping?: (mapping: string[]) => void;
}) {
  const [value, setValue] = useState(initial);
  const [chosen, setChosen] = useState<string[]>([]);
  // The consumer derives its defaults from the same parse.
  const { columnCount } = parsePastedRows(value);
  const mapping = Array.from(
    { length: columnCount },
    (_, index) => chosen[index] ?? (index === 0 ? 'bird' : 'skip'),
  );
  return (
    <PasteRows
      columns={columns}
      countLabel={countLabel}
      description="One bird per line."
      label="Paste here"
      mapping={mapping}
      onMappingChange={(next) => {
        onMapping?.(next);
        setChosen(next);
      }}
      onValueChange={setValue}
      value={value}
    />
  );
}

describe('PasteRows', () => {
  it('is a labelled, described text area with an empty status until something is pasted', () => {
    render(<Sightings />);
    const area = screen.getByRole('textbox', {
      name: 'Paste here',
      description: 'One bird per line.',
    });
    expect(area.tagName).toBe('TEXTAREA');
    expect(area.getAttribute('rows')).toBe('6');
    expect(area.getAttribute('spellcheck')).toBe('false');
    expect(screen.getByRole('status').textContent).toBe('');
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('counts the found columns and draws one named Select per column', () => {
    render(<Sightings />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Mallard\tPond\nHeron\tMarsh' },
    });
    expect(screen.getByRole('status').textContent).toBe('Found 2 columns');
    const first = screen.getByRole('combobox', { name: 'Column 1' });
    const second = screen.getByRole('combobox', { name: 'Column 2' });
    expect(first.textContent).toContain('Bird');
    expect(second.textContent).toContain('Don’t use');
  });

  it('hands the whole new mapping to onMappingChange', async () => {
    const onMapping = vi.fn();
    const user = userEvent.setup();
    render(<Sightings initial={'Mallard\tPond'} onMapping={onMapping} />);
    await user.click(screen.getByRole('combobox', { name: 'Column 2' }));
    await user.click(screen.getByRole('option', { name: 'Habitat' }));
    expect(onMapping).toHaveBeenCalledExactlyOnceWith(['bird', 'habitat']);
    expect(
      screen.getByRole('combobox', { name: 'Column 2' }).textContent,
    ).toContain('Habitat');
  });

  it('fills missing or unknown mapping entries with the first choice', async () => {
    const onMappingChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PasteRows
        columnLabel={(position) => `Columna ${position}`}
        columns={columns}
        countLabel={countLabel}
        label="Pega aquí"
        mapping={['gone']}
        onMappingChange={onMappingChange}
        onValueChange={() => {}}
        rows={3}
        value={'a,b,c'}
      />,
    );
    expect(screen.getByRole('textbox').getAttribute('rows')).toBe('3');
    await user.click(screen.getByRole('combobox', { name: 'Columna 3' }));
    await user.click(screen.getByRole('option', { name: 'Habitat' }));
    expect(onMappingChange).toHaveBeenCalledExactlyOnceWith([
      'bird',
      'bird',
      'habitat',
    ]);
  });

  it('disables the text area and leaves the column Selects out while disabled', () => {
    render(
      <PasteRows
        columns={columns}
        countLabel={countLabel}
        disabled
        label="Paste here"
        mapping={['bird', 'habitat']}
        onMappingChange={() => {}}
        onValueChange={() => {}}
        value={'Mallard\tPond'}
      />,
    );
    expect(
      screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Paste here' })
        .disabled,
    ).toBe(true);
    expect(screen.getByRole('status').textContent).toBe('Found 2 columns');
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('wires an error as Field does', () => {
    render(
      <PasteRows
        columns={columns}
        countLabel={countLabel}
        error="Paste at least one bird."
        label="Paste here"
        mapping={[]}
        onMappingChange={() => {}}
        onValueChange={() => {}}
        value=""
      />,
    );
    const area = screen.getByRole('textbox', { name: 'Paste here' });
    expect(area.getAttribute('aria-invalid')).toBe('true');
    expect(
      within(document.body).getByText('Paste at least one bird.'),
    ).toBeTruthy();
  });

  it('throws on a blank label, no columns, a repeated id or bad rows', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const paste = (props: Partial<Parameters<typeof PasteRows>[0]>) => (
      <PasteRows
        columns={columns}
        countLabel={countLabel}
        label="Paste here"
        mapping={[]}
        onMappingChange={() => {}}
        onValueChange={() => {}}
        value=""
        {...props}
      />
    );
    expect(() => render(paste({ label: ' ' }))).toThrow(RangeError);
    expect(() => render(paste({ columns: [] }))).toThrow(RangeError);
    expect(() =>
      render(
        paste({
          columns: [
            { id: 'a', label: 'A' },
            { id: 'a', label: 'B' },
          ],
        }),
      ),
    ).toThrow('Repeated PasteRows column id: a');
    expect(() =>
      render(
        paste({
          columns: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'A' },
          ],
        }),
      ),
    ).toThrow('Repeated PasteRows column label: A');
    expect(() => render(paste({ columns: [{ id: ' ', label: 'A' }] }))).toThrow(
      RangeError,
    );
    expect(() => render(paste({ columns: [{ id: 'a', label: '' }] }))).toThrow(
      RangeError,
    );
    expect(() => render(paste({ rows: 0 }))).toThrow(RangeError);
  });
});
