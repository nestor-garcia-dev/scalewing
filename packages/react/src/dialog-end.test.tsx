import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import { Dialog, dialogPlacements } from './components/Dialog.js';
import { Text } from './components/Text.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

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
  vi.restoreAllMocks();
});

const css = generateStylesheet();

describe('Dialog placement', () => {
  it('adds the side panel class only for end, beside the size and sheet', () => {
    render(
      <>
        <Dialog
          closeLabel="Close"
          footer={<Button>Add</Button>}
          onClose={() => {}}
          open
          placement="end"
          sheetBelow="md"
          size="lg"
          title="Add birds"
        >
          <Text>Paste the list.</Text>
        </Dialog>
        <Dialog onClose={() => {}} open placement="center" title="Confirm">
          <Text>Release the heron?</Text>
        </Dialog>
      </>,
    );
    const panel = screen.getByRole('dialog', { name: 'Add birds' });
    expect(panel.className).toContain(
      'sw-dialog sw-dialog-lg sw-dialog-sheet-below-md sw-dialog-end',
    );
    // The same frame: close button, footer.
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
    expect(panel.querySelector('.sw-dialog-footer')).not.toBeNull();
    expect(
      screen.getByRole('dialog', { name: 'Confirm' }).className,
    ).not.toContain('sw-dialog-end');
    expect(dialogPlacements).toEqual(['center', 'end']);
  });

  it('asks onClose on Escape and from its close button, as Dialog does', () => {
    const onClose = vi.fn();
    render(
      <Dialog
        closeLabel="Close"
        onClose={onClose}
        open
        placement="end"
        title="Add birds"
      >
        <Text>Paste the list.</Text>
      </Dialog>,
    );
    const panel = screen.getByRole('dialog', { name: 'Add birds' });
    fireEvent.keyDown(panel, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(panel.hasAttribute('open')).toBe(true);
  });

  it('pairs only with sheetBelow md, the one layout breakpoint, where the panel starts', async () => {
    const { breakpoints } = await import('./css/breakpoints.js');
    const { dialogEndFrom } = await import('./css/css-dialog-end.js');
    // The bottom sheet below md and the side panel from md never overlap.
    expect(breakpoints).toEqual(['md']);
    expect(dialogEndFrom).toBe('md');
  });

  it('throws on an unknown placement', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Dialog
          onClose={() => {}}
          open
          placement={'start' as 'end'}
          title="Add birds"
        >
          <Text>Paste the list.</Text>
        </Dialog>,
      ),
    ).toThrow('Unknown Dialog placement: start');
  });

  it('is a full-height panel at the inline end from md, after the banded rules', () => {
    const start = css.indexOf(
      '@media (min-width: 48rem) {\n  .sw-dialog-end {',
    );
    expect(start).toBeGreaterThan(css.indexOf('.sw-dialog-banded {'));
    expect(start).toBeGreaterThan(css.indexOf('.sw-dialog-has-grabber'));
    const block = css.slice(
      start,
      css.indexOf('@keyframes sw-dialog-end-in', start),
    );
    for (const declaration of [
      'border-radius: 0;',
      'border-inline-start-width: 1px;',
      'height: 100%;',
      'margin-inline-start: auto;',
      'max-height: none;',
      'flex-direction: column;',
      'animation-name: sw-dialog-end-in-rtl;',
      '.sw-dialog-end > .sw-stack {\n    flex: 1 0 auto;',
      '.sw-dialog-end .sw-dialog-footer {\n    margin-top: auto;',
    ])
      expect(block).toContain(declaration);
    expect(css).toContain(
      '@media (prefers-reduced-motion: reduce) {\n  .sw-dialog-end[open] { animation: none; }\n}',
    );
    expect(css).toContain(
      '.sw-dialog-end { border-inline-start-color: CanvasText; }',
    );
    expect(utilityClassCatalog()).toContain('sw-dialog-end');
  });
});
