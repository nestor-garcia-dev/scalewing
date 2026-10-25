import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Stepper, type StepperProps } from './components/Stepper.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

type Overrides = Partial<Omit<StepperProps, 'value' | 'onChange'>> & {
  initial?: number | null;
  onChangeSpy?: (value: number | null) => void;
};

/** A controlled Stepper that saves as you go, as a consumer holds it. */
function Saved({ initial = 4, onChangeSpy, ...props }: Overrides) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <Stepper
      decrementLabel="One less"
      incrementLabel="One more"
      label="Herons"
      max={10}
      {...props}
      onChange={(next) => {
        onChangeSpy?.(next);
        setValue(next);
      }}
      value={value}
    />
  );
}

function parts() {
  return {
    count: screen.getByRole('spinbutton') as HTMLInputElement,
    less: screen.getByRole('button', { name: 'One less' }),
    more: screen.getByRole('button', { name: 'One more' }),
  };
}

describe('Stepper onCommit', () => {
  it('commits once after − / + presses settle, with the final count', () => {
    const onCommit = vi.fn();
    render(<Saved onCommit={onCommit} />);
    const { more, less } = parts();
    fireEvent.click(more);
    fireEvent.click(more);
    act(() => vi.advanceTimersByTime(599));
    fireEvent.click(more);
    fireEvent.click(less);
    act(() => vi.advanceTimersByTime(599));
    expect(onCommit).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(6);
  });

  it('takes its own delay', () => {
    const onCommit = vi.fn();
    render(<Saved commitDelay={200} onCommit={onCommit} />);
    fireEvent.click(parts().more);
    act(() => vi.advanceTimersByTime(199));
    expect(onCommit).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onCommit).toHaveBeenCalledWith(5);
  });

  it('commits a typed count on blur, never per digit', () => {
    const onCommit = vi.fn();
    const onChangeSpy = vi.fn();
    render(<Saved onChangeSpy={onChangeSpy} onCommit={onCommit} />);
    const { count } = parts();
    fireEvent.focus(count);
    fireEvent.change(count, { target: { value: '' } });
    fireEvent.change(count, { target: { value: '1' } });
    fireEvent.change(count, { target: { value: '12' } });
    act(() => vi.advanceTimersByTime(5000));
    expect(onCommit).not.toHaveBeenCalled();
    // onChange keeps reporting every typed count, outside the bounds too.
    expect(onChangeSpy.mock.calls).toEqual([[null], [1], [12]]);
    fireEvent.blur(count);
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(12);
  });

  it('commits on Enter, and not again on the blur after it', () => {
    const onCommit = vi.fn();
    render(<Saved onCommit={onCommit} />);
    const { count } = parts();
    fireEvent.change(count, { target: { value: '7' } });
    fireEvent.keyDown(count, { key: 'Enter' });
    expect(onCommit).toHaveBeenCalledWith(7);
    fireEvent.blur(count);
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('commits an emptied box as null', () => {
    const onCommit = vi.fn();
    render(<Saved onCommit={onCommit} />);
    const { count } = parts();
    fireEvent.change(count, { target: { value: '' } });
    fireEvent.blur(count);
    expect(onCommit).toHaveBeenCalledWith(null);
  });

  it('commits step keys after they settle, and blur commits them at once', () => {
    const onCommit = vi.fn();
    render(<Saved onCommit={onCommit} />);
    const { count } = parts();
    fireEvent.keyDown(count, { key: 'ArrowUp' });
    fireEvent.keyDown(count, { key: 'ArrowUp' });
    fireEvent.keyDown(count, { key: 'End' });
    act(() => vi.advanceTimersByTime(600));
    expect(onCommit).toHaveBeenLastCalledWith(10);
    fireEvent.keyDown(count, { key: 'Home' });
    fireEvent.blur(count);
    expect(onCommit).toHaveBeenLastCalledWith(0);
    act(() => vi.advanceTimersByTime(600));
    expect(onCommit).toHaveBeenCalledTimes(2);
  });

  it('does not commit an unchanged count', () => {
    const onCommit = vi.fn();
    render(<Saved onCommit={onCommit} />);
    const { count, more, less } = parts();
    fireEvent.focus(count);
    fireEvent.blur(count);
    fireEvent.keyDown(count, { key: 'Enter' });
    // Up and back down again ends where it started.
    fireEvent.click(more);
    fireEvent.click(less);
    act(() => vi.advanceTimersByTime(600));
    // Typed back to the same count.
    fireEvent.change(count, { target: { value: '' } });
    fireEvent.change(count, { target: { value: '4' } });
    fireEvent.blur(count);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('compares with the last committed count', () => {
    const onCommit = vi.fn();
    render(<Saved onCommit={onCommit} />);
    const { count } = parts();
    fireEvent.change(count, { target: { value: '8' } });
    fireEvent.blur(count);
    fireEvent.change(count, { target: { value: '' } });
    fireEvent.change(count, { target: { value: '8' } });
    fireEvent.blur(count);
    expect(onCommit.mock.calls).toEqual([[8]]);
  });

  it('takes a count the consumer sets as the new baseline', () => {
    const onCommit = vi.fn();
    const { rerender } = render(
      <Stepper
        decrementLabel="One less"
        incrementLabel="One more"
        label="Herons"
        onChange={() => {}}
        onCommit={onCommit}
        value={4}
      />,
    );
    rerender(
      <Stepper
        decrementLabel="One less"
        incrementLabel="One more"
        label="Herons"
        onChange={() => {}}
        onCommit={onCommit}
        value={9}
      />,
    );
    fireEvent.blur(parts().count);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('calls the latest onCommit', () => {
    const first = vi.fn();
    const second = vi.fn();
    function Swapping() {
      const [value, setValue] = useState<number | null>(1);
      return (
        <Stepper
          decrementLabel="One less"
          incrementLabel="One more"
          label="Herons"
          onChange={setValue}
          onCommit={value === 1 ? first : second}
          value={value}
        />
      );
    }
    render(<Swapping />);
    fireEvent.click(parts().more);
    act(() => vi.advanceTimersByTime(600));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(2);
  });

  it('commits a waiting count when it unmounts', () => {
    const onCommit = vi.fn();
    const { unmount } = render(<Saved onCommit={onCommit} />);
    fireEvent.click(parts().more);
    unmount();
    expect(onCommit).toHaveBeenCalledWith(5);
    act(() => vi.advanceTimersByTime(600));
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('keeps working without onCommit', () => {
    const onChangeSpy = vi.fn();
    render(<Saved onChangeSpy={onChangeSpy} />);
    const { count, more } = parts();
    fireEvent.click(more);
    fireEvent.keyDown(count, { key: 'Enter' });
    fireEvent.blur(count);
    act(() => vi.advanceTimersByTime(600));
    expect(onChangeSpy).toHaveBeenCalledWith(5);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'throws for commitDelay %s',
    (commitDelay) => {
      expect(() => render(<Saved commitDelay={commitDelay} />)).toThrow(
        new RangeError(
          'Stepper commitDelay must be a finite number of zero or more',
        ),
      );
    },
  );
});
