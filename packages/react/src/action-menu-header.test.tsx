import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionMenu } from './components/ActionMenu.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const items = [
  {
    id: 'language',
    label: 'English',
    lang: 'en',
    onSelect: vi.fn(),
  },
  { id: 'sign-out', label: 'Cerrar sesión', onSelect: vi.fn() },
];

function openMenu(header?: React.ReactNode) {
  render(
    <ActionMenu
      header={header}
      items={items}
      label="Alex Rivera · Administrador"
    />,
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Alex Rivera · Administrador' }),
  );
  return screen.getByRole('menu', { name: 'Alex Rivera · Administrador' });
}

describe('ActionMenu header', () => {
  it('keeps the markup without a header: the menu is the popover', () => {
    const menu = openMenu();
    expect(menu.className).toBe('sw-action-menu-list');
    expect(menu.hasAttribute('aria-describedby')).toBe(false);
    expect(document.querySelector('.sw-action-menu-header')).toBeNull();
  });

  it('puts the header above the commands, outside the menu, describing it', () => {
    const menu = openMenu(
      <>
        <strong>Alex Rivera</strong>
        <span>Administrador · Solo lectura</span>
      </>,
    );
    const popover = menu.parentElement as HTMLElement;
    expect(popover.className).toBe('sw-action-menu-list');
    expect(menu.className).toBe('sw-action-menu-items');
    const header = popover.firstElementChild as HTMLElement;
    expect(header.className).toBe('sw-action-menu-header');
    expect(header.textContent).toBe('Alex RiveraAdministrador · Solo lectura');
    expect(menu.getAttribute('aria-describedby')).toBe(header.id);
    // Not a command: the menu owns only the items, and the arrow keys
    // move between them.
    expect(menu.contains(header)).toBe(false);
    const commands = screen.getAllByRole('menuitem');
    expect(commands).toHaveLength(2);
    expect(document.activeElement).toBe(commands[0]);
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: 'ArrowDown',
    });
    expect(document.activeElement).toBe(commands[1]);
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: 'ArrowDown',
    });
    expect(document.activeElement).toBe(commands[0]);
    // The trigger controls the popover that holds both.
    expect(
      screen
        .getByRole('button', { name: 'Alex Rivera · Administrador' })
        .getAttribute('aria-controls'),
    ).toBe(popover.id);
  });

  it('treats null and false as no header', () => {
    expect(openMenu(null).className).toBe('sw-action-menu-list');
    cleanup();
    expect(openMenu(false).className).toBe('sw-action-menu-list');
  });

  it('generates a muted header set off by a hairline', () => {
    const css = generateStylesheet();
    expect(css).toMatch(
      /\.sw-action-menu-header \{\n {2}border-bottom: 1px solid var\(--sw-color-border\);\n {2}color: var\(--sw-color-muted\);/,
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-action-menu-header', 'sw-action-menu-items']),
    );
  });
});

describe('ActionMenuItem lang', () => {
  it('marks a label in another language, and only that one', () => {
    openMenu();
    const [english, signOut] = screen.getAllByRole('menuitem');
    expect(english?.querySelector('[lang]')?.getAttribute('lang')).toBe('en');
    expect(english?.querySelector('[lang]')?.textContent).toBe('English');
    expect(signOut?.querySelector('[lang]')).toBeNull();
    expect(english?.getAttribute('lang')).toBeNull();
  });
});
