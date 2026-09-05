import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Split } from './components/Split.js';
import { Text } from './components/Text.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => {
  cleanup();
});

describe('Split', () => {
  it('renders a labeled separator beside the start pane', () => {
    const onCollapsedChange = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Split
          collapsed={false}
          label="Watch list"
          onCollapsedChange={onCollapsedChange}
        >
          <Text>Range notes stay labeled.</Text>
        </Split>
      </ThemeProvider>,
    );

    const pane = document.querySelector('.sw-split-pane');
    expect(document.querySelector('.sw-split')).not.toBeNull();
    expect(pane).not.toBeNull();
    expect(screen.getByText('Range notes stay labeled.')).toBeTruthy();
    const handle = screen.getByRole('separator', { name: 'Resize Watch list' });
    expect(handle.className).toContain('sw-split-handle');
    expect(handle.querySelector('.sw-split-grip')).not.toBeNull();
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('aria-controls')).toBe(pane?.id);

    fireEvent.keyDown(handle, { key: 'Enter' });
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it('expands a collapsed pane when the handle is clicked', () => {
    const onCollapsedChange = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Split
          collapsed
          label="Watch list"
          onCollapsedChange={onCollapsedChange}
        >
          <Text>Range notes stay labeled.</Text>
        </Split>
      </ThemeProvider>,
    );

    const handle = screen.getByRole('separator', { name: 'Show Watch list' });
    fireEvent.pointerDown(handle, { button: 0, clientX: 10, pointerId: 1 });
    fireEvent.pointerUp(handle, { button: 0, clientX: 10, pointerId: 1 });
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
  });
});
