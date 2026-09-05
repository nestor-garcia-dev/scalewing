import { cleanup, render, screen } from '@testing-library/react';
import {
  afterEach,
  beforeAll,
  afterAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Text } from './components/Text.js';
import { Toast } from './components/Toast.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

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
    if (selector === ':popover-open') {
      return this.hasAttribute('data-popover-open');
    }
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
  vi.unstubAllGlobals();
});

describe('Toast', () => {
  it('shows a non-modal status on the popover layer', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Toast open onOpenChange={() => undefined}>
          <Text variant="data">+3</Text>
        </Toast>
      </ThemeProvider>,
    );

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast.className).toContain('sw-toast');
    expect(toast.className).toContain('sw-padding-3');
    expect(toast.getAttribute('popover')).toBe('manual');
    expect(toast.hasAttribute('data-popover-open')).toBe(true);
    expect(screen.getByText('+3')).toBeTruthy();
  });

  it('auto-dismisses after timeoutMs without trapping focus', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Toast open onOpenChange={onOpenChange} timeoutMs={400}>
          <Text variant="data">+3</Text>
        </Toast>
      </ThemeProvider>,
    );

    expect(onOpenChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('travels from an anchor to a target', () => {
    const origin = document.createElement('button');
    const destination = document.createElement('span');
    document.body.append(origin, destination);
    const empty = {
      x: 0,
      y: 0,
      bottom: 0,
      right: 0,
      toJSON() {
        return {};
      },
    };
    const rects = new Map<Element, DOMRect>([
      [
        origin,
        { ...empty, left: 10, top: 20, width: 40, height: 20 } as DOMRect,
      ],
      [
        destination,
        { ...empty, left: 200, top: 80, width: 80, height: 20 } as DOMRect,
      ],
    ]);
    const measure = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        return (
          rects.get(this) ??
          ({ ...empty, left: 0, top: 0, width: 20, height: 10 } as DOMRect)
        );
      });

    render(
      <ThemeProvider colorScheme="light">
        <Toast
          anchor={origin}
          open
          onOpenChange={() => undefined}
          target={destination}
        >
          <Text variant="data">+3</Text>
        </Toast>
      </ThemeProvider>,
    );

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast.className).toContain('sw-toast-travel');
    expect(toast.style.getPropertyValue('--sw-toast-from-x')).toBe('20px');
    expect(toast.style.getPropertyValue('--sw-toast-to-x')).toBe('230px');
    measure.mockRestore();
    origin.remove();
    destination.remove();
  });

  it('lets a travel animation finish instead of the fallback timeout', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));
    const origin = document.createElement('button');
    const destination = document.createElement('span');
    document.body.append(origin, destination);
    const onOpenChange = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <Toast
          anchor={origin}
          open
          onOpenChange={onOpenChange}
          target={destination}
          timeoutMs={800}
        >
          <Text variant="data">+3</Text>
        </Toast>
      </ThemeProvider>,
    );

    vi.advanceTimersByTime(5000);
    expect(onOpenChange).not.toHaveBeenCalled();
    origin.remove();
    destination.remove();
  });
});
