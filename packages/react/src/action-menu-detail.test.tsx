import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionMenu } from './components/ActionMenu.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function open(items: Parameters<typeof ActionMenu>[0]['items']) {
  render(<ActionMenu items={items} label="Account" trigger="Kim" />);
  fireEvent.click(screen.getByRole('button', { name: 'Account' }));
  return screen.getByRole('menu', { name: 'Account' });
}

describe('ActionMenu item detail and separator', () => {
  it('ends a command with its detail and a hidden chevron, read in its name', () => {
    const menu = open([
      {
        id: 'language',
        label: 'Language',
        detail: 'Español',
        detailLang: 'es',
        onSelect: vi.fn(),
      },
      { id: 'out', label: 'Sign out', onSelect: vi.fn() },
    ]);
    const language = screen.getByRole('menuitem', {
      name: /^Language ?Español$/,
    });
    const detail = language.querySelector('.sw-action-menu-detail');
    expect(detail?.querySelector('[lang="es"]')?.textContent).toBe('Español');
    expect(
      detail
        ?.querySelector('.sw-action-menu-chevron')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(
      screen
        .getByRole('menuitem', { name: 'Sign out' })
        .querySelector('.sw-action-menu-detail'),
    ).toBeNull();
    expect(menu.querySelector('[role="separator"]')).toBeNull();
  });

  it('draws a separator before a command, never before the first', () => {
    const menu = open([
      { id: 'a', label: 'Profile', separatorBefore: true, onSelect: vi.fn() },
      { id: 'b', label: 'Sign out', separatorBefore: true, onSelect: vi.fn() },
    ]);
    const separators = menu.querySelectorAll('[role="separator"]');
    expect(separators).toHaveLength(1);
    expect(separators[0]!.nextElementSibling?.textContent).toBe('Sign out');
    // The arrow keys move between commands only.
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('moves with the arrow keys, Home and End across separators', () => {
    const menu = open([
      { id: 'a', label: 'Profile', onSelect: vi.fn() },
      {
        id: 'b',
        label: 'Language',
        detail: 'English',
        separatorBefore: true,
        onSelect: vi.fn(),
      },
      { id: 'c', label: 'Sign out', separatorBefore: true, onSelect: vi.fn() },
    ]);
    const focused = () => (document.activeElement as HTMLElement).textContent;
    expect(menu.querySelectorAll('[role="separator"]')).toHaveLength(2);
    expect(focused()).toBe('Profile');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(focused()).toBe('Language English');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(focused()).toBe('Sign out');
    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(focused()).toBe('Language English');
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(focused()).toBe('Profile');
    fireEvent.keyDown(menu, { key: 'End' });
    expect(focused()).toBe('Sign out');
  });

  it('fails closed on a blank detail, a blank detailLang or one without a detail', () => {
    for (const broken of [
      { detail: ' ' },
      { detail: 'English', detailLang: ' ' },
      { detailLang: 'en' },
    ])
      expect(() =>
        render(
          <ActionMenu
            items={[{ id: 'a', label: 'A', onSelect: vi.fn(), ...broken }]}
            label="Account"
          />,
        ),
      ).toThrow(RangeError);
  });
});

describe('ActionMenu detail CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-action-menu-detail',
        'sw-action-menu-chevron',
        'sw-action-menu-separator',
      ]),
    );
  });

  it('pushes the muted detail to the end, mirrors the chevron and rules the separator', () => {
    expect(css).toMatch(
      /\.sw-action-menu-detail \{[^}]*color: var\(--sw-color-muted\);[^}]*margin-inline-start: auto;/,
    );
    expect(css).toMatch(
      /\.sw-action-menu-chevron \{[^}]*transform: rotate\(-45deg\);/,
    );
    expect(css).toContain(
      '.sw-action-menu-chevron:dir(rtl) {\n  transform: rotate(135deg);\n}',
    );
    expect(css).toContain(
      '.sw-action-menu-separator {\n  border-top: 1px solid var(--sw-color-border);',
    );
    // A long detail wraps between words only; forced colours keep the chevron.
    expect(css).toMatch(
      /\.sw-action-menu-detail \{[^}]*overflow-wrap: normal;/,
    );
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-action-menu-chevron { border-color: CanvasText; }\n}',
    );
  });
});
