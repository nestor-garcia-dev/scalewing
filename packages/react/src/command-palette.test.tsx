import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  herons,
  otters,
  renderPalette,
  report,
  stubDialogs,
} from './command-palette.test-support.js';
import { CommandPalette } from './components/CommandPalette.js';
import {
  isEditable,
  isModK,
  usesCommandKey,
} from './components/command-palette/shortcut.js';

beforeAll(stubDialogs);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

function field(): HTMLElement {
  return screen.getByRole('combobox', { name: 'Search' });
}

function active(): HTMLElement {
  return document.getElementById(
    field().getAttribute('aria-activedescendant') ?? '',
  )!;
}

describe('CommandPalette', () => {
  it('is a modal dialog with a focused combobox over an open grouped listbox', () => {
    renderPalette();
    const dialog = screen.getByRole('dialog', { name: 'Search' });
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog.className).toBe('sw-command-palette');
    expect(document.activeElement).toBe(field());
    expect(field().getAttribute('placeholder')).toBe('Search species');
    const list = screen.getByRole('listbox', { name: 'Search' });
    expect(field().getAttribute('aria-controls')).toBe(list.id);
    expect(field().getAttribute('aria-expanded')).toBe('true');
    expect(
      within(list).getByRole('group', { name: 'Species' }).children,
    ).toHaveLength(3);
    expect(active().textContent).toContain('Eurasian otter');
    expect(active().getAttribute('aria-selected')).toBe('true');
    // The active row holds the hidden Enter key cap.
    const key = active().querySelector('.sw-command-palette-key');
    expect(key?.getAttribute('aria-hidden')).toBe('true');
    expect(
      screen.getByRole('option', { name: /^Grey heron ?Heron Marsh$/ }),
    ).toBeTruthy();
  });

  it('starts over at the first row each time it opens', () => {
    renderPalette({ initiallyOpen: false });
    fireEvent.click(screen.getByRole('button', { name: 'Opener' }));
    fireEvent.keyDown(field(), { key: 'ArrowUp' });
    expect(active().textContent).toContain('Report a sighting');
    fireEvent.keyDown(field(), { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Opener' }));
    expect(active().textContent).toContain('Eurasian otter');
  });

  it('runs a chosen item once closed, so it can move focus to the page', () => {
    let openWhenRun: boolean | undefined;
    const goToNotes = vi.fn(() => {
      openWhenRun = document
        .querySelector('.sw-command-palette')
        ?.hasAttribute('open');
      screen.getByRole('textbox', { name: 'Notes' }).focus();
    });
    renderPalette({
      initiallyOpen: false,
      groups: [
        {
          id: 'go',
          label: 'Go to',
          items: [{ id: 'notes', label: 'Notes', onSelect: goToNotes }],
        },
      ],
    });
    fireEvent.click(screen.getByRole('button', { name: 'Opener' }));
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(goToNotes).toHaveBeenCalledTimes(1);
    expect(openWhenRun).toBe(false);
    expect(document.activeElement).toBe(
      screen.getByRole('textbox', { name: 'Notes' }),
    );
  });

  it('does nothing on the arrows or Enter with no items', () => {
    const { onOpenChange } = renderPalette({
      groups: [{ id: 'species', label: 'Species', items: [] }],
    });
    fireEvent.keyDown(field(), { key: 'ArrowDown' });
    fireEvent.keyDown(field(), { key: 'ArrowUp' });
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(field().hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('closes on a press on the backdrop', () => {
    const { onOpenChange } = renderPalette();
    const dialog = screen.getByRole('dialog', { name: 'Search' });
    fireEvent.pointerDown(dialog, { clientX: 900, clientY: 900 });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('draws nothing inside while closed', () => {
    renderPalette({ initiallyOpen: false });
    expect(
      document.querySelector('.sw-command-palette')?.children,
    ).toHaveLength(0);
  });

  it('moves the active row with the arrows, wrapping, and chooses with Enter', () => {
    const { onOpenChange } = renderPalette();
    fireEvent.keyDown(field(), { key: 'ArrowUp' });
    expect(active().textContent).toContain('Report a sighting');
    fireEvent.keyDown(field(), { key: 'ArrowDown' });
    expect(active().textContent).toContain('Eurasian otter');
    fireEvent.keyDown(field(), { key: 'ArrowDown' });
    expect(active().textContent).toContain('Grey heron');
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(herons).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('leaves Enter to an input method while it composes', () => {
    renderPalette();
    fireEvent.keyDown(field(), { key: 'Enter', isComposing: true });
    expect(otters).not.toHaveBeenCalled();
  });

  it('chooses a row with a press and follows only real pointer moves', () => {
    renderPalette();
    const actionRow = screen.getByRole('option', { name: 'Report a sighting' });
    fireEvent.pointerMove(actionRow, { clientX: 5, clientY: 5 });
    expect(active()).toBe(actionRow);
    fireEvent.keyDown(field(), { key: 'ArrowDown' });
    fireEvent.pointerMove(
      screen.getByRole('option', { name: 'Report a sighting' }),
      { clientX: 5, clientY: 5 },
    );
    expect(active().textContent).toContain('Eurasian otter');
    expect(fireEvent.mouseDown(actionRow)).toBe(false);
    expect(fireEvent.mouseDown(field())).toBe(true);
    fireEvent.click(actionRow);
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('hands the words to the consumer and starts the active row over', () => {
    const onQueryChange = vi.fn();
    renderPalette({ onQueryChange });
    fireEvent.keyDown(field(), { key: 'ArrowDown' });
    fireEvent.change(field(), { target: { value: 'her' } });
    expect(onQueryChange).toHaveBeenCalledWith('her');
    expect(active().textContent).toContain('Eurasian otter');
  });

  it('closes with Escape and returns focus to where it was', () => {
    const { onOpenChange } = renderPalette({ initiallyOpen: false });
    const opener = screen.getByRole('button', { name: 'Opener' });
    opener.focus();
    fireEvent.click(opener);
    expect(document.activeElement).toBe(field());
    fireEvent.keyDown(field(), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('shows and announces the empty words, the count, or loading', async () => {
    const { rerender } = render(
      <CommandPalette
        countText={(n) => `${n} results`}
        emptyText="Nothing matches"
        groups={[{ id: 'species', label: 'Species', items: [] }]}
        hint="↑↓ to move · Enter to open"
        label="Search"
        onOpenChange={() => undefined}
        onQueryChange={() => undefined}
        open
        query="zebra"
      />,
    );
    // Empty as it opens, then filled, so the first words are announced.
    expect(screen.getByRole('status').textContent).toBe('');
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe('Nothing matches'),
    );
    expect(field().getAttribute('aria-expanded')).toBe('false');
    expect(
      document.querySelector('.sw-command-palette-message')?.textContent,
    ).toBe('Nothing matches');
    expect(screen.getByRole('listbox', { hidden: true }).hidden).toBe(true);
    expect(field().hasAttribute('aria-activedescendant')).toBe(false);
    expect(screen.queryByRole('group')).toBeNull();
    expect(
      document.querySelector('.sw-command-palette-hint')?.textContent,
    ).toBe('↑↓ to move · Enter to open');
    rerender(
      <CommandPalette
        countText={(n) => `${n} results`}
        emptyText="Nothing matches"
        groups={[]}
        label="Search"
        loading
        loadingText="Searching…"
        onOpenChange={() => undefined}
        onQueryChange={() => undefined}
        open
        query="zebra"
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('Searching…');
    rerender(
      <CommandPalette
        countText={(n) => `${n} results`}
        emptyText="Nothing matches"
        groups={[
          {
            id: 'species',
            label: 'Species',
            items: [{ id: 'z', label: 'Zebra', onSelect: () => undefined }],
          },
        ]}
        label="Search"
        onOpenChange={() => undefined}
        onQueryChange={() => undefined}
        open
        query="zebra"
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('1 results');
    expect(field().getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('.sw-command-palette-message')).toBeNull();
  });
});

describe('CommandPalette shortcut', () => {
  function press(target: EventTarget, init: KeyboardEventInit) {
    act(() => {
      target.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          ...init,
        }),
      );
    });
  }

  it('opens on Ctrl+K off Apple systems, and closes again from its own field', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    const { onOpenChange } = renderPalette({
      initiallyOpen: false,
      shortcut: 'mod+k',
    });
    press(document.body, { key: 'k', metaKey: true });
    expect(onOpenChange).not.toHaveBeenCalled();
    press(document.body, { key: 'k', ctrlKey: true });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(document.activeElement).toBe(field());
    press(field(), { key: 'K', ctrlKey: true });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('opens on ⌘K on Apple systems and is left alone in another text field', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
    const { onOpenChange } = renderPalette({
      initiallyOpen: false,
      shortcut: 'mod+k',
    });
    press(screen.getByRole('textbox', { name: 'Notes' }), {
      key: 'k',
      metaKey: true,
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    press(screen.getByRole('button', { name: 'Opener' }), {
      key: 'k',
      metaKey: true,
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('stops listening when unmounted or when the shortcut is taken away', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    const onOpenChange = vi.fn();
    const palette = (shortcut: 'mod+k' | null) => (
      <CommandPalette
        emptyText="Nothing matches"
        groups={[]}
        label="Search"
        onOpenChange={onOpenChange}
        onQueryChange={() => undefined}
        open={false}
        query=""
        shortcut={shortcut}
      />
    );
    const { rerender, unmount } = render(palette('mod+k'));
    press(document.body, { key: 'k', ctrlKey: true });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    rerender(palette(null));
    press(document.body, { key: 'k', ctrlKey: true });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    rerender(palette('mod+k'));
    unmount();
    press(document.body, { key: 'k', ctrlKey: true });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('listens to nothing without a shortcut', () => {
    const { onOpenChange } = renderPalette({ initiallyOpen: false });
    press(document.body, { key: 'k', ctrlKey: true });
    press(document.body, { key: 'k', metaKey: true });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('knows the command key, editable targets and the keys', () => {
    expect(usesCommandKey('MacIntel')).toBe(true);
    expect(usesCommandKey('iPhone')).toBe(true);
    expect(usesCommandKey('Linux x86_64')).toBe(false);
    const base = {
      key: 'k',
      code: 'KeyK',
      metaKey: false,
      ctrlKey: true,
      altKey: false,
      shiftKey: false,
      repeat: false,
      isComposing: false,
    };
    expect(isModK(base, false)).toBe(true);
    expect(isModK({ ...base, shiftKey: true }, false)).toBe(false);
    expect(isModK({ ...base, repeat: true }, false)).toBe(false);
    expect(isModK({ ...base, metaKey: true }, false)).toBe(false);
    expect(isModK(base, true)).toBe(false);
    // A layout that types another letter in K's place.
    expect(isModK({ ...base, key: 'л' }, false)).toBe(true);
    expect(isModK({ ...base, key: 'j', code: 'KeyJ' }, false)).toBe(false);
    const text = document.createElement('input');
    const box = document.createElement('input');
    box.type = 'checkbox';
    const area = document.createElement('textarea');
    expect(isEditable(text)).toBe(true);
    expect(isEditable(box)).toBe(false);
    expect(isEditable(area)).toBe(true);
    expect(isEditable(document.body)).toBe(false);
  });
});
