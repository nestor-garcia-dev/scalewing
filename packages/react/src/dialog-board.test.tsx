import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { ActionBar } from './components/ActionBar.js';
import { Badge } from './components/Badge.js';
import { Button } from './components/Button.js';
import { Dialog, type DialogProps } from './components/Dialog.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const actions = (
  <>
    <Button variant="secondary" onPress={() => undefined}>
      Cancel
    </Button>
    <Button onPress={() => undefined}>Save tally</Button>
  </>
);

function sheet(props: Partial<DialogProps> = {}) {
  return (
    <Dialog
      footer={actions}
      onClose={() => undefined}
      open
      title="Tally the roost"
      {...props}
    >
      <p>Count each roost once.</p>
    </Dialog>
  );
}

describe('ActionBar and Dialog summary with no figure yet', () => {
  it('leaves an empty value out and keeps the live region for the first figure', () => {
    const bar = (value: string) => (
      <ActionBar summary={{ label: 'Counted', value, detail: 'of 12' }}>
        {actions}
      </ActionBar>
    );
    const { rerender } = render(bar(''));
    const status = screen.getByRole('status');
    expect(status.childElementCount).toBe(0);
    rerender(bar('  '));
    expect(status.childElementCount).toBe(0);
    rerender(bar('9'));
    // The same region takes the figure, so it is announced.
    expect(screen.getByRole('status')).toBe(status);
    expect(status.textContent).toBe('Counted 9 of 12');
  });

  it('keeps a Dialog footer region empty for an empty value', () => {
    render(sheet({ summary: { label: 'Counted', value: '' } }));
    const status = screen.getByRole('status');
    expect(status.className).toBe('sw-dialog-footer-status');
    expect(status.childElementCount).toBe(0);
  });

  it('still refuses a blank label or a value that is not a string', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(sheet({ summary: { label: ' ', value: '9' } })),
    ).toThrow('ActionBar summary needs a label');
    expect(() =>
      render(
        sheet({ summary: { label: 'Counted', value: 9 as unknown as string } }),
      ),
    ).toThrow('ActionBar summary value must be a string');
  });
});

describe('Dialog status line', () => {
  it('puts the line after the figure and before the actions, in the live region', () => {
    render(
      sheet({
        status: 'Saved on this device',
        summary: { label: 'Counted', value: '9' },
      }),
    );
    const footer = document.querySelector('.sw-dialog-footer')!;
    const [status, buttons] = [...footer.children];
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.textContent).toBe('Counted 9Saved on this device');
    const note = status?.lastElementChild;
    expect(note?.className).toBe('sw-dialog-footer-note');
    expect(buttons?.className).toBe('sw-dialog-footer-actions');
  });

  it('holds a Badge and words, and makes a footer on its own', () => {
    render(
      sheet({
        footer: undefined,
        status: (
          <span>
            <Badge tone="success">Ready</Badge> All roosts counted
          </span>
        ),
      }),
    );
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Ready All roosts counted');
    expect(document.querySelector('.sw-dialog-footer-actions')).toBeNull();
  });

  it('leaves the line and the footer out for nothing or blank words', () => {
    for (const status of [false, null, '', '  ']) {
      render(sheet({ footer: undefined, status }));
      expect(document.querySelector('.sw-dialog-footer')).toBeNull();
      cleanup();
    }
    render(sheet({ status: '' }));
    expect(document.querySelector('.sw-dialog-footer-note')).toBeNull();
    expect(screen.getByRole('status').childElementCount).toBe(0);
  });
});

describe('Dialog canvas and sheet grabber', () => {
  it('puts the grouped canvas class on the dialog, and refuses an unknown one', () => {
    const { rerender } = render(sheet({ canvas: 'grouped' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('sw-dialog-canvas-grouped');
    rerender(sheet({ canvas: 'default' }));
    expect(dialog.className).not.toContain('sw-dialog-canvas-grouped');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(sheet({ canvas: 'grey' as never }))).toThrow(
      'Unknown Dialog canvas: grey',
    );
  });

  it('draws a hidden grabber first, and needs sheetBelow', () => {
    render(sheet({ sheetBelow: 'md', sheetGrabber: true }));
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('sw-dialog-has-grabber');
    const grabber = dialog.firstElementChild!;
    expect(grabber.className).toBe('sw-dialog-grabber');
    expect(grabber.getAttribute('aria-hidden')).toBe('true');
    expect(grabber.childElementCount).toBe(0);
    cleanup();
    render(sheet({ sheetBelow: 'md' }));
    expect(document.querySelector('.sw-dialog-grabber')).toBeNull();
    expect(screen.getByRole('dialog').className).not.toContain(
      'sw-dialog-has-grabber',
    );
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(sheet({ sheetGrabber: true }))).toThrow(
      'Dialog sheetGrabber needs sheetBelow',
    );
  });

  it('generates the rules from tokens and lists the classes', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-dialog.sw-dialog-canvas-grouped {\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n  background: var(--sw-canvas-grouped);\n}',
    );
    expect(css).toContain('.sw-dialog-grabber { display: none; }');
    expect(css).toMatch(
      /@media not all and \(min-width: 48rem\) \{\n {2}\.sw-dialog-sheet-below-md \.sw-dialog-grabber \{[^}]*display: block;[^}]*position: sticky;/,
    );
    // Forced colours override the bar inside the same breakpoint, at the
    // same specificity, so it wins.
    expect(css).toContain(
      '  @media (forced-colors: active) {\n    .sw-dialog-sheet-below-md .sw-dialog-grabber { background: CanvasText; forced-color-adjust: none; }\n  }',
    );
    expect(css).toContain(
      '.sw-dialog-footer-note {\n  color: var(--sw-color-muted);',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-dialog-canvas-grouped',
        'sw-dialog-grabber',
        'sw-dialog-has-grabber',
        'sw-dialog-footer-note',
      ]),
    );
  });
});
