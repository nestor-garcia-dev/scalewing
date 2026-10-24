import { act, cleanup, render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useElementHeight } from './components/use-element-height.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

let height = 0;

function Probe({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const measured = useElementHeight(ref, enabled);
  return (
    <div ref={ref} data-testid="box">
      {measured === null ? 'none' : String(measured)}
    </div>
  );
}

function stubHeight() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => ({ height }) as DOMRect,
  );
}

function stubObserver() {
  const observer = {
    callback: (() => undefined) as () => void,
    observe: vi.fn(),
    disconnect: vi.fn(),
  };
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        observer.callback = callback;
      }
      observe = observer.observe;
      disconnect = observer.disconnect;
    },
  );
  return observer;
}

describe('useElementHeight', () => {
  it('re-measures on a size change and disconnects on unmount', () => {
    height = 40;
    stubHeight();
    const observer = stubObserver();
    const { getByTestId, unmount } = render(<Probe />);
    expect(getByTestId('box').textContent).toBe('40');
    expect(observer.observe).toHaveBeenCalledWith(getByTestId('box'));
    height = 52.5;
    act(() => observer.callback());
    expect(getByTestId('box').textContent).toBe('52.5');
    unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('is null while the box draws nothing, and follows it from 0 and back', () => {
    height = 0;
    stubHeight();
    const observer = stubObserver();
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('box').textContent).toBe('none');
    height = 48;
    act(() => observer.callback());
    expect(getByTestId('box').textContent).toBe('48');
    height = 0;
    act(() => observer.callback());
    expect(getByTestId('box').textContent).toBe('none');
  });

  it('measures nothing while disabled', () => {
    height = 40;
    stubHeight();
    const observer = stubObserver();
    const { getByTestId } = render(<Probe enabled={false} />);
    expect(getByTestId('box').textContent).toBe('none');
    expect(observer.observe).not.toHaveBeenCalled();
  });

  it('falls back to window resizes without ResizeObserver, removing the listener on unmount', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    height = 30;
    stubHeight();
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { getByTestId, unmount } = render(<Probe />);
    expect(getByTestId('box').textContent).toBe('30');
    const listener = add.mock.calls.find(([type]) => type === 'resize')?.[1];
    expect(listener).toBeTypeOf('function');
    height = 36;
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(getByTestId('box').textContent).toBe('36');
    unmount();
    expect(remove).toHaveBeenCalledWith('resize', listener);
  });
});
