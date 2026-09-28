import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionMenu, type ActionMenuItem } from './components/ActionMenu.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

const originalShowPopover = HTMLElement.prototype.showPopover;
const originalHidePopover = HTMLElement.prototype.hidePopover;
const originalMatches = HTMLElement.prototype.matches;

afterEach(() => {
  cleanup();
  HTMLElement.prototype.showPopover = originalShowPopover;
  HTMLElement.prototype.hidePopover = originalHidePopover;
  HTMLElement.prototype.matches = originalMatches;
});

function renderMenu(items: readonly ActionMenuItem[], disabled = false) {
  render(
    <ThemeProvider colorScheme="light">
      <ActionMenu disabled={disabled} items={items} label="Sighting actions" />
      <button type="button">Outside</button>
    </ThemeProvider>,
  );
  return screen.getByRole('button', { name: 'Sighting actions' });
}

const shareOnly: readonly ActionMenuItem[] = [
  { id: 'share', label: 'Share sighting', onSelect: vi.fn() },
];

type Size = { width: number; height: number };

type Layout = {
  viewport: Size;
  /** The root's client box; 0 (unset) falls back to the window size. */
  client?: Size;
  trigger: { x: number; y: number; width: number; height: number };
  menu: Size;
};

/**
 * Lays out the trigger and the menu, which jsdom does not, and reads the
 * layout on every call, so a test may change it while the menu is open.
 */
function withLayout(layout: Layout, run: () => void) {
  const prototype = HTMLElement.prototype;
  const rect = prototype.getBoundingClientRect;
  const offsetWidth = Object.getOwnPropertyDescriptor(prototype, 'offsetWidth');
  const offsetHeight = Object.getOwnPropertyDescriptor(
    prototype,
    'offsetHeight',
  );
  const root = document.documentElement;
  const { innerWidth, innerHeight } = window;
  try {
    window.innerWidth = layout.viewport.width;
    window.innerHeight = layout.viewport.height;
    Object.defineProperty(root, 'clientWidth', {
      configurable: true,
      get: () => layout.client?.width ?? 0,
    });
    Object.defineProperty(root, 'clientHeight', {
      configurable: true,
      get: () => layout.client?.height ?? 0,
    });
    prototype.getBoundingClientRect = function () {
      return this.classList.contains('sw-action-menu-trigger')
        ? DOMRect.fromRect(layout.trigger)
        : rect.call(this);
    };
    Object.defineProperty(prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return this.getAttribute('role') === 'menu' ? layout.menu.width : 0;
      },
    });
    Object.defineProperty(prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return this.getAttribute('role') === 'menu' ? layout.menu.height : 0;
      },
    });
    run();
  } finally {
    window.innerWidth = innerWidth;
    window.innerHeight = innerHeight;
    Reflect.deleteProperty(root, 'clientWidth');
    Reflect.deleteProperty(root, 'clientHeight');
    prototype.getBoundingClientRect = rect;
    if (offsetWidth)
      Object.defineProperty(prototype, 'offsetWidth', offsetWidth);
    if (offsetHeight)
      Object.defineProperty(prototype, 'offsetHeight', offsetHeight);
  }
}

describe('ActionMenu', () => {
  it('opens a labelled command menu and invokes an action once', () => {
    const share = vi.fn();
    const trigger = renderMenu([
      { id: 'share', label: 'Share sighting', onSelect: share },
      { id: 'archive', label: 'Archive sighting', onSelect: vi.fn() },
    ]);

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    const menu = screen.getByRole('menu', { name: 'Sighting actions' });
    expect(menu.className).toContain('sw-action-menu-list');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const command = screen.getByRole('menuitem', { name: 'Share sighting' });
    expect(document.activeElement).toBe(command);
    fireEvent.click(command);
    fireEvent.click(command);
    expect(share).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('navigates enabled actions with arrows, Home, End, and Escape', () => {
    const edit = vi.fn();
    const deleteAction = vi.fn();
    const trigger = renderMenu([
      { id: 'edit', label: 'Edit', onSelect: edit },
      { id: 'disabled', label: 'Disabled', disabled: true, onSelect: vi.fn() },
      {
        id: 'delete',
        label: 'Delete',
        destructive: true,
        onSelect: deleteAction,
      },
    ]);

    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    const menu = screen.getByRole('menu');
    const editButton = screen.getByRole('menuitem', { name: 'Edit' });
    const deleteButton = screen.getByRole('menuitem', { name: 'Delete' });
    expect(document.activeElement).toBe(deleteButton);
    expect(deleteButton.className).toContain('sw-action-menu-item-danger');
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(editButton);
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(deleteButton);
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(editButton);
    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(deleteButton);
    fireEvent.keyDown(menu, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(edit).not.toHaveBeenCalled();
    expect(deleteAction).not.toHaveBeenCalled();
  });

  it('supports Enter and Space on the trigger and preserves outside focus', () => {
    const action = vi.fn();
    const trigger = renderMenu([
      { id: 'edit', label: 'Edit', onSelect: action },
    ]);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('menu')).toBeTruthy();
    const outside = screen.getByRole('button', { name: 'Outside' });
    outside.focus();
    fireEvent.pointerDown(outside);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(outside);
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.keyDown(trigger, { key: ' ' });
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('disables an empty or disabled menu and excludes disabled commands', () => {
    const blocked = vi.fn();
    const trigger = renderMenu([
      { id: 'blocked', label: 'Blocked', disabled: true, onSelect: blocked },
    ]);
    expect(trigger).toHaveProperty('disabled', true);
    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(blocked).not.toHaveBeenCalled();
  });

  it.each(['Enter', ' '])('activates a focused command once with %s', (key) => {
    const action = vi.fn();
    const trigger = renderMenu([
      { id: 'share', label: 'Share sighting', onSelect: action },
    ]);
    fireEvent.click(trigger);
    const command = screen.getByRole('menuitem', { name: 'Share sighting' });
    expect(document.activeElement).toBe(command);
    fireEvent.keyDown(command, { key });
    expect(action).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(command);
    expect(action).toHaveBeenCalledOnce();
  });

  it('opens and closes the native popover layer with menu state', () => {
    HTMLElement.prototype.showPopover = function showPopover() {
      this.setAttribute('data-popover-open', '');
    };
    HTMLElement.prototype.hidePopover = function hidePopover() {
      this.removeAttribute('data-popover-open');
    };
    HTMLElement.prototype.matches = function matches(selector: string) {
      if (selector === ':popover-open')
        return this.hasAttribute('data-popover-open');
      return originalMatches.call(this, selector);
    };

    const trigger = renderMenu([
      { id: 'share', label: 'Share sighting', onSelect: vi.fn() },
    ]);
    // The menu is rendered only while open.
    expect(screen.queryByRole('menu', { hidden: true })).toBeNull();
    fireEvent.click(trigger);
    // jsdom's own :popover-open does not see the stub, so it reads as hidden.
    const menu = screen.getByRole('menu', { hidden: true });
    expect(menu.getAttribute('popover')).toBe('manual');
    expect(menu.hasAttribute('data-popover-open')).toBe(true);
    fireEvent.keyDown(menu, { key: 'Escape' });
    expect(menu.hasAttribute('data-popover-open')).toBe(false);
    expect(screen.queryByRole('menu', { hidden: true })).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens a gap below the trigger, inset from the viewport edge', () => {
    withLayout(
      {
        viewport: { width: 390, height: 844 },
        trigger: { x: 337, y: 100, width: 37, height: 28 },
        menu: { width: 160, height: 120 },
      },
      () => {
        fireEvent.click(renderMenu(shareOnly));
        const menu = screen.getByRole('menu');
        // Lined up with the trigger's end (374 - 160), 4 px (space-1) below it.
        expect(menu.style.left).toBe('214px');
        expect(menu.style.top).toBe('132px');
      },
    );
  });

  it('fits the viewport without a classic scrollbar', () => {
    withLayout(
      {
        // A 15 px scrollbar on each axis: innerWidth and innerHeight
        // include it, the root's client box does not.
        viewport: { width: 390, height: 844 },
        client: { width: 375, height: 829 },
        trigger: { x: 300, y: 740, width: 37, height: 28 },
        menu: { width: 350, height: 60 },
      },
      () => {
        fireEvent.click(renderMenu(shareOnly));
        const menu = screen.getByRole('menu');
        // Clamped to 375 - 8 - 350, not 390 - 8 - 350 = 32.
        expect(menu.style.left).toBe('17px');
        // 768 + 4 + 60 passes 829 - 8, so it opens above: 740 - 4 - 60.
        expect(menu.style.top).toBe('676px');
      },
    );
  });

  it('closes and rejects a pending command when disabled after opening', () => {
    const action = vi.fn();
    const items = [{ id: 'share', label: 'Share sighting', onSelect: action }];
    const { rerender } = render(
      <ActionMenu items={items} label="Sighting actions" />,
    );
    const trigger = screen.getByRole('button', { name: 'Sighting actions' });
    fireEvent.click(trigger);
    const command = screen.getByRole('menuitem', { name: 'Share sighting' });
    rerender(<ActionMenu disabled items={items} label="Sighting actions" />);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveProperty('disabled', true);
    fireEvent.click(command);
    expect(action).not.toHaveBeenCalled();
  });

  it('returns focus to the trigger before running a selected command', () => {
    let focusedDuringSelect: Element | null = null;
    const trigger = renderMenu([
      {
        id: 'delete',
        label: 'Delete sighting',
        destructive: true,
        onSelect: () => {
          focusedDuringSelect = document.activeElement;
        },
      },
    ]);

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete sighting' }));
    expect(focusedDuringSelect).toBe(trigger);
    expect(document.activeElement).toBe(trigger);

    focusedDuringSelect = null;
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(
      screen.getByRole('menuitem', { name: 'Delete sighting' }),
      { key: 'Enter' },
    );
    expect(focusedDuringSelect).toBe(trigger);
  });
});
