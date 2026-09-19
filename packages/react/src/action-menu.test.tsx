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
    const menu = screen.getByRole('menu', { hidden: true });
    expect(menu.getAttribute('popover')).toBe('manual');
    expect(menu.hasAttribute('data-popover-open')).toBe(false);
    fireEvent.click(trigger);
    expect(menu.hasAttribute('data-popover-open')).toBe(true);
    fireEvent.keyDown(menu, { key: 'Escape' });
    expect(menu.hasAttribute('data-popover-open')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
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
});
