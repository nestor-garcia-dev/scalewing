import {
  act,
  cleanup,
  fireEvent,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { renderShell } from './app-shell.test-support.js';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function openDrawer() {
  const menu = screen.getByRole('button', { name: 'Open menu' });
  fireEvent.click(menu);
  const drawer = screen.getByRole('dialog', { name: 'Field station' });
  return { drawer, menu };
}

describe('AppShell drawer', () => {
  it('opens from the icon-only menu button with the header, nav and footer', () => {
    renderShell({ header: <span>Station</span>, footer: <span>Ranger</span> });
    const menu = screen.getByRole('button', { name: 'Open menu' });
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('aria-haspopup')).toBe('dialog');
    expect(menu.getAttribute('tabindex')).toBe('0');
    expect(menu.className).toContain('sw-app-shell-menu');
    expect(menu.querySelector('[data-glyph="menu"]')).toBeTruthy();
    // Closed, the drawer holds nothing: the page has one navigation.
    expect(screen.getAllByRole('navigation')).toHaveLength(1);

    const { drawer } = openDrawer();
    expect(drawer.hasAttribute('open')).toBe(true);
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    const close = within(drawer).getByRole('button', { name: 'Close menu' });
    expect(close.className).toContain('sw-app-shell-close');
    expect(close.getAttribute('tabindex')).toBe('0');
    expect(close.querySelector('.sw-dialog-close-glyph')).toBeTruthy();
    // The close button comes first, where the menu button was.
    expect(drawer.querySelector('button')).toBe(close);
    expect(
      within(drawer).getByRole('navigation', { name: 'Field station' }),
    ).toBeTruthy();
    expect(within(drawer).getByText('Station')).toBeTruthy();
    expect(within(drawer).getByText('Ranger')).toBeTruthy();
    // The drawer's links carry no tooltips.
    expect(within(drawer).queryByRole('tooltip', { hidden: true })).toBeNull();
  });

  it('closes on its close button and returns focus to the menu button', () => {
    renderShell();
    const { drawer, menu } = openDrawer();
    fireEvent.click(within(drawer).getByRole('button', { name: 'Close menu' }));
    expect(drawer.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(menu);
    expect(menu.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Escape and on a press outside it', () => {
    renderShell();
    let { drawer, menu } = openDrawer();
    menu.blur();
    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(drawer.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(menu);

    ({ drawer, menu } = openDrawer());
    menu.blur();
    vi.spyOn(drawer, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      right: 320,
      bottom: 800,
    } as DOMRect);
    fireEvent.pointerDown(drawer, { clientX: 600, clientY: 200 });
    expect(drawer.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(menu);
  });

  it('closes when a destination is chosen with a plain press, not a modified one', () => {
    const onNavigate = vi.fn();
    renderShell({ onNavigate });
    const { drawer, menu } = openDrawer();
    menu.blur();
    const forests = within(drawer).getByRole('link', { name: 'Forests 2' });
    expect(fireEvent.click(forests, { metaKey: true })).toBe(true);
    expect(drawer.hasAttribute('open')).toBe(true);
    expect(onNavigate).not.toHaveBeenCalled();

    expect(fireEvent.click(forests)).toBe(false);
    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'forests' }),
    );
    expect(drawer.hasAttribute('open')).toBe(false);
    // A chosen destination leaves focus to the page it moves to.
    expect(document.activeElement).not.toBe(menu);
  });

  it('closes on a plain press without onNavigate and lets the link navigate', () => {
    renderShell();
    const { drawer } = openDrawer();
    expect(
      fireEvent.click(within(drawer).getByRole('link', { name: 'Today' })),
    ).toBe(true);
    expect(drawer.hasAttribute('open')).toBe(false);
  });

  it('closes when the window widens to the sidebar', () => {
    let wide = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal('matchMedia', (query: string) => ({
      get matches() {
        return wide && query === '(min-width: 64rem)';
      },
      addEventListener: (_: string, listener: () => void) =>
        listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) =>
        listeners.delete(listener),
    }));
    renderShell();
    const { drawer, menu } = openDrawer();
    menu.blur();
    act(() => {
      wide = true;
      for (const listener of listeners) listener();
    });
    expect(drawer.hasAttribute('open')).toBe(false);
    // The bar and its menu button are gone: focus is not sent there.
    expect(document.activeElement).not.toBe(menu);
  });
});
