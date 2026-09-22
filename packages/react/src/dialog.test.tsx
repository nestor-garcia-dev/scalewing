import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import { Dialog } from './components/Dialog.js';
import { Text } from './components/Text.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

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
});

describe('Dialog', () => {
  it('opens a labeled modal dialog on the top layer', () => {
    const closed = { current: false };
    render(
      <ThemeProvider colorScheme="light">
        <Dialog
          onClose={() => {
            closed.current = true;
          }}
          open
          title="How we grade"
        >
          <Text>Injury is subtracted.</Text>
          <Button
            onPress={() => {
              closed.current = true;
            }}
          >
            Close
          </Button>
        </Dialog>
      </ThemeProvider>,
    );

    const dialog = screen.getByRole('dialog', { name: 'How we grade' });
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog.className).toContain('sw-dialog');
    expect(dialog.className).toContain('sw-padding-5');
    expect(dialog).toHaveProperty('open', true);
    expect(screen.getByText('Injury is subtracted.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(closed.current).toBe(true);
  });

  it('widens to the large size only when asked', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Dialog onClose={() => {}} open size="lg" title="Count the drawer">
          <Text>Six fields in one row.</Text>
        </Dialog>
        <Dialog onClose={() => {}} open title="Confirm">
          <Text>Reading width.</Text>
        </Dialog>
      </ThemeProvider>,
    );

    const wide = screen.getByRole('dialog', { name: 'Count the drawer' });
    expect(wide.className).toContain('sw-dialog');
    expect(wide.className).toContain('sw-dialog-lg');
    const reading = screen.getByRole('dialog', { name: 'Confirm' });
    expect(reading.className).not.toContain('sw-dialog-lg');
  });

  it('closes when the pointer lands outside the dialog box', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Dialog onClose={onClose} open title="How we grade">
          <Text>Injury is subtracted.</Text>
        </Dialog>
      </ThemeProvider>,
    );

    const dialog = screen.getByRole('dialog', { name: 'How we grade' });
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      top: 100,
      right: 200,
      bottom: 200,
      left: 100,
      toJSON() {
        return {};
      },
    });

    fireEvent.pointerDown(dialog, { clientX: 10, clientY: 10 });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(dialog, { clientX: 150, clientY: 150 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
