import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import { Dialog, type DialogAppearance } from './components/Dialog.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

afterEach(() => cleanup());

describe('Dialog appearance', () => {
  it('keeps the glass panel and a bare heading by default', () => {
    render(
      <Dialog onClose={() => undefined} open title="Count the herons">
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Count the herons' });
    expect(dialog.className).not.toContain('sw-dialog-banded');
    expect(dialog.querySelector('.sw-dialog-header')).toBeNull();
  });

  it('bands a full sheet: the class, the title row, the close button and the footer', () => {
    const onClose = vi.fn();
    render(
      <Dialog
        appearance="banded"
        closeLabel="Close"
        description="The same herons leave the river count."
        footer={
          <>
            <Button onPress={() => undefined} variant="secondary">
              Cancel
            </Button>
            <Button onPress={() => undefined}>Move 14 herons</Button>
          </>
        }
        onClose={onClose}
        open
        size="xl"
        title="Move herons to the lake"
      >
        <p>Count the herons by colony.</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', {
      name: 'Move herons to the lake',
    });
    expect(dialog.className).toContain('sw-dialog-banded');
    const header = dialog.querySelector('.sw-dialog-header');
    expect(header).not.toBeNull();
    // The close button is still the named first control and asks onClose.
    const close = within(dialog).getByRole('button', { name: 'Close' });
    expect(header!.contains(close)).toBe(true);
    close.click();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog.querySelector('.sw-dialog-footer')).not.toBeNull();
    expect(dialog.getAttribute('aria-describedby')).toBe(
      screen.getByText('The same herons leave the river count.').id,
    );
  });

  it('bands a lone title too, with the heading still naming the dialog', () => {
    render(
      <Dialog
        appearance="banded"
        onClose={() => undefined}
        open
        title="Count the herons"
      >
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Count the herons' });
    const header = dialog.querySelector('.sw-dialog-header');
    expect(header?.querySelector('h3')?.textContent).toBe('Count the herons');
    expect(header?.className).toBe('sw-dialog-header');
  });

  it('fails closed on an unknown appearance', () => {
    expect(() =>
      render(
        <Dialog
          appearance={'frosted' as DialogAppearance}
          onClose={() => undefined}
          open
          title="x"
        >
          <p>Body</p>
        </Dialog>,
      ),
    ).toThrow(RangeError);
  });
});

describe('Dialog banded CSS', () => {
  const css = generateStylesheet();

  it('catalogs the class and draws a solid sheet with an elevation', () => {
    expect(utilityClassCatalog()).toContain('sw-dialog-banded');
    expect(css).toContain(`.sw-dialog-banded {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--sw-color-surface);
  border-color: transparent;
  box-shadow: var(--sw-elevation-md);
}`);
  });

  it('bleeds the title row to the edges over a hairline, after the frame rules', () => {
    const band = `.sw-dialog-banded .sw-dialog-header {
  align-items: center;
  background: var(--sw-color-surface);
  border-bottom: 1px solid var(--sw-color-border);
  margin: calc(-1 * var(--sw-space-5)) calc(-1 * var(--sw-space-5)) 0;
  padding: var(--sw-space-4) var(--sw-space-5);
  position: sticky;
  top: calc(-1 * var(--sw-space-5));
  z-index: 5;
}`;
    expect(css).toContain(band);
    expect(css.indexOf(band)).toBeGreaterThan(
      css.indexOf('.sw-dialog-header-framed {'),
    );
  });

  it("bleeds a bottom sheet's band past its safe-area side padding", () => {
    expect(css)
      .toContain(`.sw-dialog-sheet-below-md.sw-dialog-banded .sw-dialog-header {
    margin-left: calc(-1 * max(var(--sw-space-5), env(safe-area-inset-left, 0px)));`);
    expect(css).toContain(
      'padding-right: max(var(--sw-space-5), env(safe-area-inset-right, 0px));',
    );
  });

  it('puts the close button on a round quiet fill, after its touch-target rules', () => {
    const close = `.sw-dialog-banded .sw-button.sw-dialog-close {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-text);
  margin: 0;
}`;
    expect(css).toContain(close);
    expect(css.indexOf(close)).toBeGreaterThan(
      css.indexOf('.sw-button.sw-dialog-close {'),
    );
    expect(css).toContain(
      '@media (hover: hover) {\n  .sw-dialog-banded .sw-button.sw-dialog-close:hover {',
    );
    expect(css).toContain(
      '.sw-dialog-banded .sw-dialog-header { border-bottom-color: CanvasText; }',
    );
  });
});
