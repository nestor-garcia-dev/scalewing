import {
  act,
  cleanup,
  fireEvent,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderSwitcher, stations } from './context-switcher.test-support.js';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function openWith(props: Parameters<typeof renderSwitcher>[0] = {}) {
  const view = renderSwitcher(props);
  fireEvent.click(screen.getByRole('button', { name: /^Station/ }));
  return view;
}

function activeOption(): HTMLElement {
  const owner = screen.queryByRole('combobox') ?? screen.getByRole('listbox');
  const id = owner.getAttribute('aria-activedescendant');
  return document.getElementById(id ?? '')!;
}

describe('ContextSwitcher', () => {
  it('is a button named by its label and what it shows, closed at first', () => {
    renderSwitcher();
    const trigger = screen.getByRole('button', { name: 'Station Heron Marsh' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('tabindex')).toBe('0');
    expect(trigger.className).toBe(
      'sw-context-switcher-trigger sw-context-switcher-trigger-framed',
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('names an icon trigger by its label and the current option', () => {
    renderSwitcher({
      trigger: <svg data-glyph="crest" />,
      triggerAppearance: 'icon',
    });
    const trigger = screen.getByRole('button', { name: 'Station Heron Marsh' });
    expect(trigger.className).toContain('sw-context-switcher-trigger-icon');
    cleanup();
    renderSwitcher({
      currentId: undefined,
      trigger: <svg />,
      triggerAppearance: 'icon',
    });
    expect(screen.getByRole('button', { name: 'Station' })).toBeTruthy();
  });

  it('opens a dialog with a grouped listbox, the current option selected and checked', () => {
    openWith();
    const dialog = screen.getByRole('dialog', { name: 'Station' });
    const list = within(dialog).getByRole('listbox', { name: 'Station' });
    expect(document.activeElement).toBe(list);
    expect(
      screen
        .getByRole('button', { name: /^Station/ })
        .getAttribute('aria-expanded'),
    ).toBe('true');
    const group = within(list).getByRole('group', {
      name: 'Stations you run',
    });
    expect(within(group).getAllByRole('option')).toHaveLength(4);
    const heron = within(list).getByRole('option', {
      // jsdom drops the spaces between the parts; the browser spec reads them.
      name: /^Heron Marsh ?Warden ?Live$/,
    });
    expect(heron.getAttribute('aria-selected')).toBe('true');
    expect(heron.querySelector('.sw-context-switcher-check')).toBeTruthy();
    expect(activeOption()).toBe(heron);
    const pine = within(list).getByRole('option', {
      name: /^Pine Ridge ?Ranger$/,
    });
    expect(pine.getAttribute('aria-selected')).toBe('false');
    expect(pine.querySelector('.sw-context-switcher-check')).toBeNull();
  });

  it('reads a count in the option name, a countLabel in place of the number', () => {
    openWith();
    const all = screen.getByRole('option', {
      name: /^All stations ?7 need you$/,
    });
    const pill = all.querySelector('.sw-context-switcher-count');
    expect(pill?.className).toBe(
      'sw-context-switcher-count sw-context-switcher-count-warning',
    );
    expect(pill?.getAttribute('aria-hidden')).toBe('true');
    expect(
      screen.getByRole('option', { name: /^Bittern Fen ?2$/ }),
    ).toBeTruthy();
    expect(
      all
        .querySelector('[data-glyph="all"]')
        ?.parentElement?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('moves the active row with the arrows, Home and End, and chooses with Enter', () => {
    const { onSelect } = openWith();
    const list = screen.getByRole('listbox');
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(activeOption().textContent).toContain('Pine Ridge');
    fireEvent.keyDown(list, { key: 'End' });
    expect(activeOption().textContent).toContain('Bayside Dunes');
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(activeOption().textContent).toContain('Bayside Dunes');
    fireEvent.keyDown(list, { key: 'Home' });
    expect(activeOption().textContent).toContain('All stations');
    fireEvent.keyDown(list, { key: 'ArrowUp' });
    expect(activeOption().textContent).toContain('All stations');
    fireEvent.keyDown(list, { key: 'Enter' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onSelect).toHaveBeenCalledWith(stations[0]!.options[0]);
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /^Station/ }),
    );
  });

  it('jumps by typeahead and chooses with Space between words', () => {
    vi.useFakeTimers();
    const { onSelect } = openWith();
    const list = screen.getByRole('listbox');
    fireEvent.keyDown(list, { key: 'b' });
    expect(activeOption().textContent).toContain('Bittern Fen');
    fireEvent.keyDown(list, { key: 'b' });
    expect(activeOption().textContent).toContain('Bayside Dunes');
    act(() => vi.advanceTimersByTime(600));
    fireEvent.keyDown(list, { key: 'p' });
    fireEvent.keyDown(list, { key: 'i' });
    expect(activeOption().textContent).toContain('Pine Ridge');
    act(() => vi.advanceTimersByTime(600));
    fireEvent.keyDown(list, { key: ' ' });
    expect(onSelect).toHaveBeenCalledWith(stations[1]!.options[1]);
  });

  it('closes with Escape, focus back on the trigger, choosing nothing', () => {
    const { onSelect } = openWith();
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /^Station/ }),
    );
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('only closes when the current option is chosen again', () => {
    const { onSelect } = openWith();
    fireEvent.click(screen.getByRole('option', { name: /^Heron Marsh/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('chooses a row with a press and follows the pointer', () => {
    const { onSelect } = openWith();
    const pine = screen.getByRole('option', { name: /^Pine Ridge/ });
    fireEvent.pointerMove(pine);
    expect(pine.getAttribute('data-active')).toBe('true');
    fireEvent.click(pine);
    expect(onSelect).toHaveBeenCalledWith(stations[1]!.options[1]);
  });

  it('opens from either arrow key on the trigger', () => {
    for (const key of ['ArrowDown', 'ArrowUp']) {
      renderSwitcher();
      fireEvent.keyDown(screen.getByRole('button', { name: /^Station/ }), {
        key,
      });
      expect(screen.getByRole('dialog')).toBeTruthy();
      cleanup();
    }
  });

  it('keeps focus through a press on a caption or a row, not on the field or a command', () => {
    openWith({
      filter: { label: 'Find', emptyText: 'None' },
      actions: [{ id: 'new', label: 'New station', onSelect: vi.fn() }],
    });
    const heading = screen.getByText('Stations you run');
    expect(fireEvent.mouseDown(heading)).toBe(false);
    expect(
      fireEvent.mouseDown(screen.getByRole('option', { name: /^Pine/ })),
    ).toBe(false);
    expect(fireEvent.mouseDown(screen.getByRole('combobox'))).toBe(true);
    expect(
      fireEvent.mouseDown(screen.getByRole('button', { name: 'New station' })),
    ).toBe(true);
  });

  it('ignores a pointer move with no movement, as a list scrolled under it reports', () => {
    openWith();
    const list = screen.getByRole('listbox');
    const pine = screen.getByRole('option', { name: /^Pine/ });
    const bay = screen.getByRole('option', { name: /^Bayside/ });
    fireEvent.pointerMove(pine, { clientX: 20, clientY: 40 });
    expect(activeOption()).toBe(pine);
    fireEvent.keyDown(list, { key: 'End' });
    expect(activeOption()).toBe(bay);
    fireEvent.pointerMove(pine, { clientX: 20, clientY: 40 });
    expect(activeOption()).toBe(bay);
    fireEvent.pointerMove(pine, { clientX: 21, clientY: 40 });
    expect(activeOption()).toBe(pine);
  });

  it('leaves Enter to an input method while it composes', () => {
    const { onSelect } = openWith({
      filter: { label: 'Find', emptyText: 'None' },
    });
    fireEvent.keyDown(screen.getByRole('combobox'), {
      key: 'Enter',
      isComposing: true,
    });
    fireEvent.keyDown(screen.getByRole('combobox'), {
      key: 'Enter',
      keyCode: 229,
    });
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('sets the trigger’s width on the popup for its least width', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(44);
    openWith();
    expect(
      screen
        .getByRole('dialog')
        .style.getPropertyValue('--sw-context-switcher-trigger-width'),
    ).toBe('44px');
    vi.restoreAllMocks();
  });

  it('closes on a press outside and when focus leaves it, focus staying there', () => {
    openWith();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^Station/ }));
    const outside = document.createElement('button');
    document.body.append(outside);
    fireEvent.blur(screen.getByRole('listbox'), { relatedTarget: outside });
    expect(screen.queryByRole('dialog')).toBeNull();
    outside.remove();
  });

  it('closes when Shift+Tab takes focus back to the trigger, not on a press on it', () => {
    openWith();
    const trigger = screen.getByRole('button', { name: /^Station/ });
    fireEvent.blur(screen.getByRole('listbox'), { relatedTarget: trigger });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(trigger);
    fireEvent.pointerDown(trigger);
    fireEvent.blur(screen.getByRole('listbox'), { relatedTarget: trigger });
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.pointerUp(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('ContextSwitcher filter', () => {
  const filter = {
    label: 'Find a station',
    placeholder: 'Station name',
    emptyText: 'No station matches',
  };

  it('focuses a combobox over the listbox that narrows the options', () => {
    const { onSelect } = openWith({ filter });
    const field = screen.getByRole('combobox', { name: 'Find a station' });
    expect(document.activeElement).toBe(field);
    expect(field.getAttribute('placeholder')).toBe('Station name');
    const list = screen.getByRole('listbox');
    expect(field.getAttribute('aria-controls')).toBe(list.id);
    expect(list.hasAttribute('tabindex')).toBe(false);
    expect(activeOption().textContent).toContain('Heron Marsh');
    fireEvent.change(field, { target: { value: 'arbol' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.queryByRole('group')).not.toBeNull();
    expect(activeOption().textContent).toContain('Bayside Dunes');
    // Home and End stay with the words.
    fireEvent.keyDown(field, { key: 'Home' });
    expect(activeOption().textContent).toContain('Bayside Dunes');
    fireEvent.keyDown(field, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(stations[1]!.options[3]);
  });

  it('closes with Escape from the field, focus back on the trigger', () => {
    openWith({ filter });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'pi' } });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /^Station/ }),
    );
  });

  it('shows and announces the empty words when nothing matches', () => {
    openWith({ filter });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'otter' },
    });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('status').textContent).toBe('No station matches');
    expect(
      document.querySelector('.sw-context-switcher-empty')?.textContent,
    ).toBe('No station matches');
    expect(
      screen.getByRole('combobox').hasAttribute('aria-activedescendant'),
    ).toBe(false);
  });

  it('hides the field below minOptions', () => {
    openWith({ filter: { ...filter, minOptions: 6 } });
    expect(screen.queryByRole('combobox')).toBeNull();
    cleanup();
    openWith({ filter: { ...filter, minOptions: 5 } });
    expect(screen.getByRole('combobox')).toBeTruthy();
  });
});

describe('ContextSwitcher actions', () => {
  it('lists commands in a footer that close the popup, focus on the trigger, then run', () => {
    let focused: Element | null = null;
    const create = vi.fn(() => {
      focused = document.activeElement;
    });
    openWith({
      actions: [
        { id: 'new', label: 'New station', icon: <svg />, onSelect: create },
        { id: 'code', label: 'Enter a code', onSelect: vi.fn() },
      ],
    });
    const footer = document.querySelector('.sw-context-switcher-footer')!;
    const buttons = within(footer as HTMLElement).getAllByRole('button');
    expect(buttons.map((button) => button.textContent)).toEqual([
      'New station',
      'Enter a code',
    ]);
    fireEvent.click(buttons[0]!);
    expect(create).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(focused).toBe(screen.getByRole('button', { name: /^Station/ }));
  });

  it('closes when Tab leaves the last command, focus staying where it went', () => {
    openWith({
      actions: [{ id: 'new', label: 'New station', onSelect: vi.fn() }],
    });
    const command = screen.getByRole('button', { name: 'New station' });
    const after = document.createElement('a');
    after.href = '#after';
    document.body.append(after);
    fireEvent.blur(command, { relatedTarget: after });
    expect(screen.queryByRole('dialog')).toBeNull();
    after.remove();
  });

  it('stays open while focus leaves the window (no related target)', () => {
    openWith();
    fireEvent.blur(screen.getByRole('listbox'), { relatedTarget: null });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('keeps the popup open while focus moves to its footer', () => {
    openWith({
      actions: [{ id: 'new', label: 'New station', onSelect: vi.fn() }],
    });
    const footerButton = screen.getByRole('button', { name: 'New station' });
    fireEvent.blur(screen.getByRole('listbox'), {
      relatedTarget: footerButton,
    });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});

describe('ContextSwitcher appearance', () => {
  it('maps the appearance and width to classes', () => {
    const { container } = renderSwitcher({
      triggerAppearance: 'pill',
      width: 'full',
    });
    expect(container.firstElementChild?.className).toBe(
      'sw-context-switcher sw-context-switcher-full',
    );
    expect(screen.getByRole('button').className).toContain(
      'sw-context-switcher-trigger-pill',
    );
  });
});
