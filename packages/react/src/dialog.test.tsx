import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import {
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
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
  vi.restoreAllMocks();
});

/** A consumer that closes on request unless it is busy. */
function ControlledDialog({
  busy = false,
  children,
  onClose,
  onCancel,
  onKeyDown,
  onSubmit,
}: {
  busy?: boolean;
  children?: ReactNode;
  onClose: () => void;
  onCancel?: (event: SyntheticEvent<HTMLDialogElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;
  onSubmit?: (event: FormEvent<HTMLDialogElement>) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <ThemeProvider colorScheme="light">
      <Button onPress={() => setOpen(false)}>Done</Button>
      <Dialog
        onCancel={onCancel}
        onKeyDown={onKeyDown}
        onSubmit={onSubmit}
        onClose={() => {
          onClose();
          if (!busy) setOpen(false);
        }}
        open={open}
        title="Log a sighting"
      >
        <Text>Saving the sighting.</Text>
        {children}
      </Dialog>
    </ThemeProvider>
  );
}

function fireCancel(dialog: HTMLElement, cancelable: boolean) {
  const event = new Event('cancel', { cancelable });
  act(() => {
    dialog.dispatchEvent(event);
  });
  return event;
}

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

  it('asks onClose on Escape and lets open decide', () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
    const onClose = vi.fn();
    render(<ControlledDialog busy onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });

    const first = fireEvent.keyDown(dialog, { key: 'Escape' });
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(first).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(dialog).toHaveProperty('open', true);
    // Kept open without being closed and shown (announced) again.
    expect(showModal).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape when the consumer sets open to false', () => {
    const onClose = vi.fn();
    render(<ControlledDialog onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(dialog).toHaveProperty('open', false);
    // The native close that follows the prop does not ask again.
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not ask onClose when open turns false', () => {
    const onClose = vi.fn();
    render(<ControlledDialog onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });

    fireEvent.click(screen.getByRole('button', { name: 'Done', hidden: true }));
    expect(dialog).toHaveProperty('open', false);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('leaves Escape to a nested control that used it', () => {
    const onClose = vi.fn();
    render(<ControlledDialog onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });
    const text = screen.getByText('Saving the sighting.');
    text.addEventListener('keydown', (event) => event.preventDefault());

    fireEvent.keyDown(text, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).toHaveProperty('open', true);
  });

  it('prevents a cancel request and asks onClose unless the consumer vetoes it', () => {
    const onClose = vi.fn();
    const { unmount } = render(<ControlledDialog busy onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });
    expect(fireCancel(dialog, true).defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveProperty('open', true);
    unmount();

    const vetoed = vi.fn();
    render(
      <ControlledDialog
        onCancel={(event) => event.preventDefault()}
        onClose={vetoed}
      />,
    );
    fireCancel(screen.getByRole('dialog', { name: 'Log a sighting' }), true);
    expect(vetoed).not.toHaveBeenCalled();
  });

  it('shows again a dialog the browser closed while open stays true', () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
    const onClose = vi.fn();
    render(<ControlledDialog busy onClose={onClose} />);
    const dialog = screen.getByRole('dialog', {
      name: 'Log a sighting',
    }) as HTMLDialogElement;

    // Chromium: a repeated close request without user activation fires a
    // cancel that cannot be prevented, then closes the element.
    fireCancel(dialog, false);
    act(() => {
      dialog.close();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledTimes(2);
    expect(dialog).toHaveProperty('open', true);
  });

  it('asks onClose when a dialog form closes the element', () => {
    const onClose = vi.fn();
    render(<ControlledDialog onClose={onClose} />);
    const dialog = screen.getByRole('dialog', {
      name: 'Log a sighting',
    }) as HTMLDialogElement;

    // What a <form method="dialog"> submit does to the element.
    act(() => {
      dialog.close();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveProperty('open', false);
  });

  it('turns a dialog form submit into a close request', () => {
    const onClose = vi.fn();
    render(
      <ControlledDialog busy onClose={onClose}>
        <form method="dialog">
          <button type="submit">Save</button>
        </form>
      </ControlledDialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });
    const form = dialog.querySelector('form') as HTMLFormElement;

    expect(fireEvent.submit(form)).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveProperty('open', true);
  });

  it('turns a submitter with formmethod dialog into a close request', () => {
    const onClose = vi.fn();
    render(
      <ControlledDialog onClose={onClose}>
        <form>
          <button formMethod="dialog" type="submit">
            Discard
          </button>
        </form>
      </ControlledDialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });
    const form = dialog.querySelector('form') as HTMLFormElement;
    const discard = screen.getByRole('button', { name: 'Discard' });

    act(() => {
      form.requestSubmit(discard);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveProperty('open', false);
  });

  it('leaves an ordinary form submit and a vetoed dialog submit alone', () => {
    const onClose = vi.fn();
    render(
      <ControlledDialog
        onClose={onClose}
        onSubmit={(event) => {
          if ((event.target as HTMLFormElement).id === 'vetoed') {
            event.preventDefault();
          }
        }}
      >
        <form
          id="ordinary"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        />
        <form id="vetoed" method="dialog" />
      </ControlledDialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });

    fireEvent.submit(dialog.querySelector('#ordinary') as HTMLFormElement);
    fireEvent.submit(dialog.querySelector('#vetoed') as HTMLFormElement);
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).toHaveProperty('open', true);
  });

  it('counts a backdrop press only on the dialog element itself', () => {
    const onClose = vi.fn();
    render(<ControlledDialog busy onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(100, 100, 100, 100),
    );

    // An overflowing popover or a nested dialog's backdrop lies outside the
    // box but targets a descendant.
    fireEvent.pointerDown(screen.getByText('Saving the sighting.'), {
      clientX: 10,
      clientY: 10,
    });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.pointerDown(dialog, { clientX: 10, clientY: 10 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('leaves Escape to an input method that is composing', () => {
    const onClose = vi.fn();
    render(<ControlledDialog onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });

    fireEvent.keyDown(dialog, { key: 'Escape', keyCode: 229 });
    fireEvent.keyDown(dialog, { key: 'Escape', isComposing: true });
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).toHaveProperty('open', true);
  });

  it('calls a consumer onKeyDown first and lets it veto Escape', () => {
    const onClose = vi.fn();
    const onKeyDown = vi.fn((event: KeyboardEvent<HTMLDialogElement>) => {
      event.preventDefault();
    });
    const { unmount } = render(
      <ControlledDialog onClose={onClose} onKeyDown={onKeyDown} />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    unmount();

    const observe = vi.fn();
    render(<ControlledDialog onClose={onClose} onKeyDown={observe} />);
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Log a sighting' }), {
      key: 'Escape',
    });
    expect(observe).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores the bubbling cancel of a dismissed file picker', () => {
    const onClose = vi.fn();
    render(
      <ControlledDialog onClose={onClose}>
        <input aria-label="Photo" type="file" />
      </ControlledDialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });

    act(() => {
      screen
        .getByLabelText('Photo')
        .dispatchEvent(
          new Event('cancel', { bubbles: true, cancelable: false }),
        );
    });
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).toHaveProperty('open', true);

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveProperty('open', false);
  });

  it('calls a consumer onPointerDown and lets it veto a backdrop press', () => {
    const onClose = vi.fn();
    const onPointerDown = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Dialog
          onClose={onClose}
          onPointerDown={(event) => {
            onPointerDown();
            if (event.clientY < 50) event.preventDefault();
          }}
          open
          title="Log a sighting"
        >
          <Text>Saving the sighting.</Text>
        </Dialog>
      </ThemeProvider>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Log a sighting' });
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(100, 100, 100, 100),
    );

    fireEvent.pointerDown(dialog, { clientX: 10, clientY: 10 });
    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.pointerDown(dialog, { clientX: 10, clientY: 300 });
    expect(onPointerDown).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('lets Escape clear a search field before it asks to close', () => {
    const onClose = vi.fn();
    render(
      <ControlledDialog onClose={onClose}>
        <input aria-label="Species" defaultValue="lynx" type="search" />
      </ControlledDialog>,
    );
    const search = screen.getByLabelText('Species') as HTMLInputElement;

    expect(fireEvent.keyDown(search, { key: 'Escape' })).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    // The browser clears the field; the next Escape asks to close.
    fireEvent.change(search, { target: { value: '' } });
    expect(fireEvent.keyDown(search, { key: 'Escape' })).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe('nested in another Dialog', () => {
    function renderNested() {
      const outerClose = vi.fn();
      const innerClose = vi.fn();
      function Nested() {
        const [innerOpen, setInnerOpen] = useState(true);
        return (
          <ThemeProvider colorScheme="light">
            <Dialog onClose={outerClose} open title="Transect">
              <Dialog
                onClose={() => {
                  innerClose();
                  setInnerOpen(false);
                }}
                open={innerOpen}
                title="Habitat"
              >
                <form method="dialog">
                  <button type="submit">Done</button>
                </form>
              </Dialog>
            </Dialog>
          </ThemeProvider>
        );
      }
      render(<Nested />);
      const outer = screen.getByRole('dialog', { name: 'Transect' });
      const inner = screen.getByRole('dialog', {
        name: 'Habitat',
      }) as HTMLDialogElement;
      return { inner, innerClose, outer, outerClose };
    }

    it('gives an inner dialog form submit to the inner dialog only', () => {
      const { inner, innerClose, outer, outerClose } = renderNested();
      fireEvent.submit(inner.querySelector('form') as HTMLFormElement);
      expect(innerClose).toHaveBeenCalledTimes(1);
      expect(inner).toHaveProperty('open', false);
      expect(outerClose).not.toHaveBeenCalled();
      expect(outer).toHaveProperty('open', true);
    });

    it('gives an inner forced cancel and close to the inner dialog only', () => {
      const { inner, innerClose, outer, outerClose } = renderNested();
      fireCancel(inner, false);
      act(() => {
        inner.close();
      });
      expect(innerClose).toHaveBeenCalledTimes(1);
      expect(inner).toHaveProperty('open', false);
      expect(outerClose).not.toHaveBeenCalled();
      expect(outer).toHaveProperty('open', true);
    });

    it('gives an inner Escape to the inner dialog only', () => {
      const { inner, innerClose, outer, outerClose } = renderNested();
      fireEvent.keyDown(screen.getByRole('button', { name: 'Done' }), {
        key: 'Escape',
      });
      expect(innerClose).toHaveBeenCalledTimes(1);
      expect(inner).toHaveProperty('open', false);
      expect(outerClose).not.toHaveBeenCalled();
      expect(outer).toHaveProperty('open', true);
    });
  });
});
