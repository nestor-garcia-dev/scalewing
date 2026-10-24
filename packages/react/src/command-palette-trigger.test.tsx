import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CommandPaletteTrigger,
  type CommandPaletteTriggerProps,
} from './components/CommandPaletteTrigger.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderTrigger(props: Partial<CommandPaletteTriggerProps> = {}) {
  const onPress = vi.fn();
  render(
    <CommandPaletteTrigger
      icon={<svg data-glyph="search" />}
      label="Search"
      onPress={onPress}
      placeholder="Search species and sites"
      shortcutLabel="⌘K"
      {...props}
    />,
  );
  return onPress;
}

describe('CommandPaletteTrigger', () => {
  it('is a search-looking button named by its label, its key hint hidden', () => {
    const onPress = renderTrigger();
    const button = screen.getByRole('button', { name: 'Search' });
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('tabindex')).toBe('0');
    expect(button.className).toBe('sw-command-palette-trigger');
    expect(button.textContent).toBe('Search species and sites⌘K');
    const key = button.querySelector('.sw-command-palette-key');
    expect(key?.getAttribute('aria-hidden')).toBe('true');
    expect(
      button
        .querySelector('[data-glyph="search"]')
        ?.parentElement?.getAttribute('aria-hidden'),
    ).toBe('true');
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is the glyph alone when compact', () => {
    renderTrigger({ compact: true });
    const button = screen.getByRole('button', { name: 'Search' });
    expect(button.className).toBe(
      'sw-command-palette-trigger sw-command-palette-trigger-compact',
    );
    expect(button.textContent).toBe('');
  });

  it.each<[string, Partial<CommandPaletteTriggerProps>, string]>([
    [
      'a blank label',
      { label: ' ' },
      'CommandPaletteTrigger label and placeholder must be nonempty',
    ],
    [
      'a blank placeholder',
      { placeholder: '' },
      'CommandPaletteTrigger label and placeholder must be nonempty',
    ],
    [
      'a blank key hint',
      { shortcutLabel: ' ' },
      'CommandPaletteTrigger shortcutLabel is nonempty when given',
    ],
    [
      'no glyph',
      { icon: null },
      'CommandPaletteTrigger needs its search glyph',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderTrigger(props)).toThrow(new RangeError(message));
  });
});
