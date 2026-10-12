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

  describe('in a container narrower than its default', () => {
    // jsdom has no layout: give the split's container a width.
    let width = 0;
    function renderIn(containerWidth: number, onCollapsedChange = vi.fn()) {
      width = containerWidth;
      vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(
        function (this: Element) {
          return this.hasAttribute('data-holder') ? width : 0;
        },
      );
      render(
        <ThemeProvider colorScheme="light">
          <div data-holder="">
            <Split label="Watch list" onCollapsedChange={onCollapsedChange}>
              <Text>Range notes stay labeled.</Text>
            </Split>
          </div>
        </ThemeProvider>,
      );
      return screen.getByRole('separator', { name: 'Resize Watch list' });
    }

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('reports the width that shows, not the 22rem it keeps', () => {
      // 600 px less the 14rem next column leaves 376 px: 352 px is 84%.
      expect(renderIn(600).getAttribute('aria-valuenow')).toBe('84');
    });

    it('keeps a narrowed pane on a move to the end and collapses it on a move to the start', () => {
      const onCollapsedChange = vi.fn();
      // 358 px less the 14rem next column leaves 134 px, under the minimum.
      const handle = renderIn(358, onCollapsedChange);
      expect(handle.getAttribute('aria-valuenow')).toBe('100');

      fireEvent.pointerDown(handle, { button: 0, clientX: 100, pointerId: 1 });
      fireEvent.pointerMove(handle, { clientX: 110, pointerId: 1 });
      fireEvent.pointerUp(handle, { clientX: 110, pointerId: 1 });
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      expect(onCollapsedChange).not.toHaveBeenCalled();
      expect(handle.getAttribute('aria-valuenow')).toBe('100');

      fireEvent.pointerDown(handle, { button: 0, clientX: 100, pointerId: 2 });
      fireEvent.pointerMove(handle, { clientX: 90, pointerId: 2 });
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('collapses a narrowed pane one key step to the start', () => {
      const onCollapsedChange = vi.fn();
      fireEvent.keyDown(renderIn(358, onCollapsedChange), { key: 'ArrowLeft' });
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('expands a pane collapsed in a narrow container to at least its minimum once the container widens', () => {
      const handle = renderIn(358);
      fireEvent.keyDown(handle, { key: 'ArrowLeft' });
      const shown = screen.getByRole('separator', { name: 'Show Watch list' });
      const pane = document.querySelector<HTMLElement>('.sw-split-pane')!;

      // Wider now: 600 px leaves 224 to 376 px.
      width = 600;
      fireEvent.keyDown(shown, { key: 'ArrowRight' });
      // The chosen 22rem shows again, not the narrowed 134 px.
      expect(pane.style.width).toBe('352px');
      expect(handle.getAttribute('aria-valuenow')).toBe('84');

      fireEvent.keyDown(handle, { key: 'Enter' });
      fireEvent.pointerDown(handle, { button: 0, clientX: 10, pointerId: 3 });
      fireEvent.pointerUp(handle, { clientX: 10, pointerId: 3 });
      expect(pane.style.width).toBe('352px');
    });

    it('shows at most the room a narrow container leaves, keeping the chosen width', () => {
      renderIn(358);
      const pane = document.querySelector<HTMLElement>('.sw-split-pane')!;
      expect(pane.style.width).toBe('134px');
    });

    it('keeps the chosen width through a move held at the end of a narrow range', () => {
      const handle = renderIn(358);
      const pane = document.querySelector<HTMLElement>('.sw-split-pane')!;
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      fireEvent.pointerDown(handle, { button: 0, clientX: 100, pointerId: 4 });
      fireEvent.pointerMove(handle, { clientX: 140, pointerId: 4 });
      fireEvent.pointerUp(handle, { clientX: 140, pointerId: 4 });
      expect(pane.style.width).toBe('134px');

      // Wider now: the chosen 22rem shows again, not the 14rem minimum.
      width = 600;
      // Any key re-measures the container; Tab moves nothing.
      fireEvent.keyDown(handle, { key: 'Tab' });
      expect(pane.style.width).toBe('352px');
      expect(handle.getAttribute('aria-valuenow')).toBe('84');
    });
  });
});
