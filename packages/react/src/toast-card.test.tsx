import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { useState } from 'react';

import { Toast, type ToastPlacement } from './components/Toast.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const originalShowPopover = HTMLElement.prototype.showPopover;
const originalHidePopover = HTMLElement.prototype.hidePopover;
const originalMatches = HTMLElement.prototype.matches;

beforeAll(() => {
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
});

afterAll(() => {
  HTMLElement.prototype.showPopover = originalShowPopover;
  HTMLElement.prototype.hidePopover = originalHidePopover;
  HTMLElement.prototype.matches = originalMatches;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function SavedToast({
  onOpenChange,
  onPress = () => undefined,
  open = true,
  placement = 'top-end',
}: {
  onOpenChange: (open: boolean) => void;
  onPress?: () => void;
  open?: boolean;
  placement?: ToastPlacement;
}) {
  return (
    <Toast
      action={{ label: 'Open', onPress }}
      icon={<svg data-testid="tick" />}
      onOpenChange={onOpenChange}
      open={open}
      placement={placement}
      showRemaining
      timeoutMs={10000}
      title="Survey saved"
      tone="success"
    >
      12 herons · 2 nests
    </Toast>
  );
}

describe('Toast as a card', () => {
  it('shows a bold title over a muted detail, the icon and an action', () => {
    render(<SavedToast onOpenChange={() => undefined} />);
    const toast = screen.getByRole('status', { hidden: true });
    expect(toast.className).toBe(
      'sw-toast sw-toast-success sw-toast-top-end sw-toast-interactive sw-padding-3',
    );
    expect(toast.querySelector('strong.sw-toast-title')?.textContent).toBe(
      'Survey saved',
    );
    expect(toast.querySelector('.sw-toast-detail')?.textContent).toBe(
      '12 herons · 2 nests',
    );
    expect(
      toast.querySelector('.sw-toast-icon')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(toast.textContent).toBe('Survey saved12 herons · 2 nestsOpen');
    const line = toast.querySelector('.sw-toast-remaining');
    expect(line?.getAttribute('aria-hidden')).toBe('true');
    expect(toast.style.getPropertyValue('--sw-toast-duration')).toBe('10000ms');
  });

  it('runs the action, then closes', () => {
    const onPress = vi.fn();
    const onOpenChange = vi.fn();
    render(<SavedToast onOpenChange={onOpenChange} onPress={onPress} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open', hidden: true }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onPress.mock.invocationCallOrder[0]).toBeLessThan(
      onOpenChange.mock.invocationCallOrder[0]!,
    );
  });

  it('holds the time left while the pointer is over it', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(<SavedToast onOpenChange={onOpenChange} />);
    const toast = screen.getByRole('status', { hidden: true });
    act(() => vi.advanceTimersByTime(4000));
    fireEvent.pointerEnter(toast);
    expect(toast.className).toContain('sw-toast-paused');
    act(() => vi.advanceTimersByTime(20000));
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.pointerLeave(toast);
    expect(toast.className).not.toContain('sw-toast-paused');
    act(() => vi.advanceTimersByTime(5999));
    expect(onOpenChange).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('holds the time left while focus is inside it', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(
      <>
        <button type="button">Elsewhere</button>
        <SavedToast onOpenChange={onOpenChange} />
      </>,
    );
    const action = screen.getByRole('button', { name: 'Open', hidden: true });
    act(() => action.focus());
    act(() => vi.advanceTimersByTime(30000));
    expect(onOpenChange).not.toHaveBeenCalled();
    act(() => screen.getByRole('button', { name: 'Elsewhere' }).focus());
    act(() => vi.advanceTimersByTime(10000));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('starts unpaused and with the whole time when it opens again', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { rerender } = render(<SavedToast onOpenChange={onOpenChange} />);
    fireEvent.pointerEnter(screen.getByRole('status', { hidden: true }));
    rerender(<SavedToast onOpenChange={onOpenChange} open={false} />);
    rerender(<SavedToast onOpenChange={onOpenChange} />);
    const toast = screen.getByRole('status', { hidden: true });
    expect(toast.className).not.toContain('sw-toast-paused');
    act(() => vi.advanceTimersByTime(9999));
    expect(onOpenChange).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('gives focus back to where it came from when it closes with focus inside', () => {
    function Saver() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button type="button">Save</button>
          <SavedToast onOpenChange={setOpen} open={open} />
        </>
      );
    }
    render(<Saver />);
    const save = screen.getByRole('button', { name: 'Save' });
    const action = screen.getByRole('button', { name: 'Open', hidden: true });
    act(() => save.focus());
    act(() => action.focus());
    fireEvent.click(action);
    expect(document.activeElement).toBe(save);
  });

  it('keeps a travelling toast travelling whatever its placement', () => {
    const anchor = document.createElement('button');
    const target = document.createElement('span');
    document.body.append(anchor, target);
    render(
      <Toast
        anchor={anchor}
        onOpenChange={() => undefined}
        open
        placement="top-end"
        showRemaining
        target={target}
      >
        +3
      </Toast>,
    );
    const toast = screen.getByRole('status', { hidden: true });
    expect(toast.className).toBe('sw-toast sw-toast-travel sw-padding-3');
    expect(toast.querySelector('.sw-toast-remaining')).toBeNull();
    anchor.remove();
    target.remove();
  });

  it('never forwards its title to the DOM as a tooltip', () => {
    render(
      <Toast onOpenChange={() => undefined} open title="Saved">
        Twelve herons.
      </Toast>,
    );
    expect(
      screen.getByRole('status', { hidden: true }).getAttribute('title'),
    ).toBeNull();
  });

  it('keeps a plain bottom toast click-through and unchanged', () => {
    render(
      <Toast onOpenChange={() => undefined} open>
        Survey saved.
      </Toast>,
    );
    const toast = screen.getByRole('status', { hidden: true });
    expect(toast.className).toBe('sw-toast sw-padding-3');
    expect(toast.innerHTML).toBe('Survey saved.');
  });

  it('fails closed on a blank title, a blank action or an unknown placement', () => {
    const close = () => undefined;
    expect(() =>
      render(
        <Toast onOpenChange={close} open title=" ">
          x
        </Toast>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Toast action={{ label: '', onPress: close }} onOpenChange={close} open>
          x
        </Toast>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Toast onOpenChange={close} open placement={'center' as ToastPlacement}>
          x
        </Toast>,
      ),
    ).toThrow(RangeError);
  });
});

describe('Toast card CSS', () => {
  const css = generateStylesheet();

  it('places top-end in the corner and runs the line down over the duration', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-toast-title',
        'sw-toast-detail',
        'sw-toast-action',
        'sw-toast-interactive',
        'sw-toast-top-end',
        'sw-toast-remaining',
        'sw-toast-paused',
      ]),
    );
    expect(css).toContain(
      'top: max(var(--sw-space-4), env(safe-area-inset-top, 0px));',
    );
    expect(css).toContain(
      'animation: sw-toast-remaining var(--sw-toast-duration, 0ms) linear forwards;',
    );
    expect(css).toContain(
      '.sw-toast-paused .sw-toast-remaining::after { animation-play-state: paused; }',
    );
    expect(css).toContain('.sw-toast-interactive { pointer-events: auto; }');
    // The corner card's rules follow the bottom toast's, so they win.
    expect(css.indexOf('.sw-toast-top-end {')).toBeGreaterThan(
      css.indexOf('.sw-toast:popover-open {'),
    );
  });
});
