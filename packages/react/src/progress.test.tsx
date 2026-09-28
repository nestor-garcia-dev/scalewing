import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Progress } from './components/Progress.js';

afterEach(() => cleanup());

describe('Progress', () => {
  it('exposes zero, partial, and complete native progress semantics', () => {
    const { rerender } = render(
      <Progress label="Registers complete" max={4} value={0} />,
    );
    const bar = screen.getByRole('progressbar', { name: 'Registers complete' });
    expect(bar).toHaveProperty('value', 0);
    expect(bar).toHaveProperty('max', 4);
    expect(screen.getByText('0 / 4')).toBeTruthy();
    rerender(
      <Progress label="Registers complete" max={4} value={2} tone="success" />,
    );
    expect(bar).toHaveProperty('value', 2);
    expect(bar.parentElement?.className).toContain('sw-progress-success');
    expect(screen.getByText('2 / 4')).toBeTruthy();
    rerender(
      <Progress label="Registers complete" max={4} value={4} tone="danger" />,
    );
    expect(bar).toHaveProperty('value', 4);
    expect(bar.parentElement?.className).toContain('sw-progress-danger');
  });

  it('hides the visible count on request and keeps the value semantics', () => {
    const { rerender } = render(
      <Progress
        label="Habitats surveyed"
        max={4}
        showCount={false}
        value={3}
      />,
    );
    const bar = screen.getByRole('progressbar', { name: 'Habitats surveyed' });
    expect(bar).toHaveProperty('value', 3);
    expect(bar).toHaveProperty('max', 4);
    expect(screen.queryByText('3 / 4')).toBeNull();
    expect(document.querySelector('.sw-progress-count')).toBeNull();
    expect(document.querySelector('.sw-progress-heading')?.textContent).toBe(
      'Habitats surveyed',
    );
    rerender(
      <Progress label="Habitats surveyed" max={4} showCount value={3} />,
    );
    const count = screen.getByText('3 / 4');
    expect(count.className).toBe('sw-progress-count');
    expect(count.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('progressbar', { name: 'Habitats surveyed' })).toBe(
      bar,
    );
  });

  it('rejects invalid labels and ranges', () => {
    expect(() => render(<Progress label=" " max={4} value={0} />)).toThrow(
      RangeError,
    );
    expect(() => render(<Progress label="Done" max={0} value={0} />)).toThrow(
      RangeError,
    );
    expect(() =>
      render(<Progress label="Done" max={Infinity} value={1} />),
    ).toThrow(RangeError);
    expect(() => render(<Progress label="Done" max={4} value={-1} />)).toThrow(
      RangeError,
    );
    expect(() => render(<Progress label="Done" max={4} value={5} />)).toThrow(
      RangeError,
    );
    expect(() =>
      render(<Progress label="Done" max={4} value={Number.NaN} />),
    ).toThrow(RangeError);
  });
});
