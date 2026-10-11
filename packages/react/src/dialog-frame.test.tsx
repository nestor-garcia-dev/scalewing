import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { Button } from './components/Button.js';
import { Dialog, type DialogSize } from './components/Dialog.js';
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

function AddSheet(props: { describedBy?: string }) {
  return (
    <Dialog
      aria-describedby={props.describedBy}
      closeLabel="Close"
      description="The same herons leave the river count."
      footer={
        <>
          <Button variant="secondary" onPress={() => undefined}>
            Cancel
          </Button>
          <Button onPress={() => undefined}>Move 14 herons</Button>
        </>
      }
      icon={<svg data-testid="tile" />}
      onClose={() => undefined}
      open
      size="xl"
      summary={{ label: 'Lake', value: '+14', detail: 'river −14' }}
      title="Move herons to the lake"
    >
      <p>Count the herons by colony.</p>
    </Dialog>
  );
}

describe('Dialog header and footer', () => {
  it('reads the icon, the title over its description, then the close button', () => {
    render(<AddSheet />);
    const dialog = screen.getByRole('dialog', {
      name: 'Move herons to the lake',
    });
    expect(dialog.className).toContain('sw-dialog sw-dialog-xl');
    const header = dialog.querySelector('.sw-dialog-header')!;
    const [icon, titles, close] = [...header.children];
    expect(header.className).toBe('sw-dialog-header sw-dialog-header-framed');
    expect(icon?.className).toBe('sw-dialog-icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.contains(screen.getByTestId('tile'))).toBe(true);
    expect(titles?.className).toBe('sw-dialog-titles');
    expect(titles?.textContent).toBe(
      'Move herons to the lakeThe same herons leave the river count.',
    );
    expect(close?.textContent).toBe('Close');
    const description = dialog.querySelector('.sw-dialog-description')!;
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
  });

  it("keeps the consumer's aria-describedby", () => {
    render(<AddSheet describedBy="elsewhere" />);
    expect(screen.getByRole('dialog').getAttribute('aria-describedby')).toBe(
      'elsewhere',
    );
  });

  it('pins the summary in a polite status and the actions at the end, last in the dialog', () => {
    render(<AddSheet />);
    const dialog = screen.getByRole('dialog');
    const footer = dialog.querySelector('.sw-dialog-footer')!;
    expect(footer.parentElement?.lastElementChild).toBe(footer);
    const status = footer.querySelector('[role="status"]')!;
    expect(status.className).toBe('sw-dialog-footer-status');
    expect(status.textContent).toBe('Lake +14 river −14');
    expect(
      [...footer.querySelectorAll('.sw-dialog-footer-actions button')].map(
        (button) => button.textContent,
      ),
    ).toEqual(['Cancel', 'Move 14 herons']);
  });

  it('is an alertdialog when asked', () => {
    render(
      <Dialog
        onClose={() => undefined}
        open
        role="alertdialog"
        title="Still counting?"
      >
        <p>The log closes in 1:42.</p>
      </Dialog>,
    );
    expect(
      screen.getByRole('alertdialog', { name: 'Still counting?' }),
    ).toBeTruthy();
  });

  it('keeps a plain dialog as it was', () => {
    render(
      <Dialog onClose={() => undefined} open title="Confirm">
        <p>Release the heron?</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Confirm' });
    expect(dialog.getAttribute('role')).toBeNull();
    expect(dialog.getAttribute('aria-describedby')).toBeNull();
    expect(dialog.querySelector('.sw-dialog-header')).toBeNull();
    expect(dialog.querySelector('.sw-dialog-footer')).toBeNull();
  });

  it('fails closed on an unknown size or role, a blank description or a blank summary', () => {
    const close = () => undefined;
    expect(() =>
      render(
        <Dialog onClose={close} open size={'xxl' as DialogSize} title="x">
          y
        </Dialog>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Dialog onClose={close} open role={'menu' as 'dialog'} title="x">
          y
        </Dialog>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Dialog description=" " onClose={close} open title="x">
          y
        </Dialog>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Dialog
          onClose={close}
          open
          summary={{ label: '', value: '1' }}
          title="x"
        >
          y
        </Dialog>,
      ),
    ).toThrow(RangeError);
  });
});

describe('Dialog frame CSS', () => {
  const css = generateStylesheet();

  it('emits xl and a sticky footer on the surface under a hairline', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-dialog-xl',
        'sw-dialog-header-framed',
        'sw-dialog-icon',
        'sw-dialog-titles',
        'sw-dialog-description',
        'sw-dialog-footer',
        'sw-dialog-footer-status',
        'sw-dialog-footer-actions',
      ]),
    );
    expect(css).toContain('--sw-dialog-max-xl: 65rem;');
    expect(css).toContain(
      '.sw-dialog-xl {\n  max-width: min(var(--sw-dialog-max-xl), calc(100vw - var(--sw-space-8)));\n}',
    );
    expect(css).toContain('border-top: 1px solid var(--sw-color-border);');
    expect(css).toContain('position: sticky;');
    // An empty status stays in the accessibility tree, only hidden.
    expect(css).toContain(
      '.sw-dialog-footer-status:empty {\n  clip-path: inset(50%);',
    );
    expect(css).not.toContain('.sw-dialog-footer-status:empty { display: none');
    // In a sheet the footer reaches the bottom edge past the safe area.
    expect(css).toContain(
      '.sw-dialog-sheet-below-md .sw-dialog-footer {\n    bottom: calc(-1 * (var(--sw-space-5) + env(safe-area-inset-bottom, 0px)));',
    );
    // The sheet rules follow xl, so a sheet still wins below its breakpoint.
    expect(css.indexOf('.sw-dialog-sheet-below-md {')).toBeGreaterThan(
      css.indexOf('.sw-dialog-xl {'),
    );
  });
});
