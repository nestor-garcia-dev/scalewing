import { render, type RenderResult } from '@testing-library/react';
import { useState } from 'react';
import { type Mock, vi } from 'vitest';

import {
  CommandPalette,
  type CommandPaletteGroup,
  type CommandPaletteProps,
} from './components/CommandPalette.js';

/** jsdom has no modal dialogs: open and close by the attribute. */
export function stubDialogs() {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

export const otters = vi.fn();
export const herons = vi.fn();
export const report = vi.fn();

/** Field results: two groups, the second with a detail. */
export const results: CommandPaletteGroup[] = [
  {
    id: 'species',
    label: 'Species',
    items: [
      { id: 'otter', label: 'Eurasian otter', icon: <svg />, onSelect: otters },
      {
        id: 'heron',
        label: 'Grey heron',
        detail: 'Heron Marsh',
        onSelect: herons,
      },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [{ id: 'report', label: 'Report a sighting', onSelect: report }],
  },
];

type Harness = Partial<CommandPaletteProps> & { initiallyOpen?: boolean };

/**
 * The palette in a page with a button before it, owning `open` and
 * `query` as a consumer would; `onOpenChange` is also a spy.
 */
export function renderPalette({
  initiallyOpen = true,
  ...props
}: Harness = {}): RenderResult & { onOpenChange: Mock } {
  const onOpenChange = vi.fn();
  function Page() {
    const [open, setOpen] = useState(initiallyOpen);
    const [query, setQuery] = useState('');
    return (
      <>
        <button onClick={() => setOpen(true)} type="button">
          Opener
        </button>
        <input aria-label="Notes" />
        <CommandPalette
          emptyText="Nothing matches"
          groups={results}
          label="Search"
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
          onQueryChange={setQuery}
          open={open}
          placeholder="Search species"
          query={query}
          {...props}
        />
      </>
    );
  }
  return { ...render(<Page />), onOpenChange };
}
