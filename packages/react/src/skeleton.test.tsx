import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Skeleton, type SkeletonProps } from './components/Skeleton.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const css = generateStylesheet();

describe('Skeleton', () => {
  it('is a status named by its words, three hidden bars by default', () => {
    render(<Skeleton label="Loading sightings" />);
    const status = screen.getByRole('status', { name: 'Loading sightings' });
    expect(status.className).toBe('sw-skeleton sw-skeleton-lines');
    expect(status.textContent).toBe('Loading sightings');
    const bars = status.querySelectorAll('.sw-skeleton-bar');
    expect(bars).toHaveLength(3);
    for (const bar of bars)
      expect(bar.getAttribute('aria-hidden')).toBe('true');
  });

  it('follows a new label in its name and words', () => {
    const { rerender } = render(<Skeleton label="Loading sightings" />);
    rerender(<Skeleton label="Loading otters" />);
    expect(
      screen.getByRole('status', { name: 'Loading otters' }).textContent,
    ).toBe('Loading otters');
  });

  it('draws three rows by default', () => {
    render(<Skeleton label="Loading teams" variant="rows" />);
    expect(
      screen.getByRole('status').querySelectorAll('.sw-skeleton-row'),
    ).toHaveLength(3);
  });

  it('draws rows of a mark and a bar', () => {
    render(<Skeleton label="Loading teams" lines={5} variant="rows" />);
    const status = screen.getByRole('status');
    expect(status.className).toBe('sw-skeleton sw-skeleton-rows');
    const rows = status.querySelectorAll('.sw-skeleton-row');
    expect(rows).toHaveLength(5);
    expect(rows[0]?.querySelector('.sw-skeleton-mark')).toBeTruthy();
    expect(rows[0]?.querySelector('.sw-skeleton-bar')).toBeTruthy();
    expect(rows[0]?.getAttribute('aria-hidden')).toBe('true');
  });

  it.each<[string, Partial<SkeletonProps>, string]>([
    ['blank words', { label: ' ' }, 'Skeleton label must be nonempty'],
    [
      'no lines',
      { lines: 0 },
      'Skeleton lines must be a whole number from 1 to 6: 0',
    ],
    [
      'seven lines',
      { lines: 7 },
      'Skeleton lines must be a whole number from 1 to 6: 7',
    ],
    [
      'a fraction',
      { lines: 2.5 },
      'Skeleton lines must be a whole number from 1 to 6: 2.5',
    ],
    [
      'an unknown variant',
      { variant: 'cards' as never },
      'Skeleton variant must be one of lines, rows',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Skeleton label="Loading" {...props} />)).toThrow(
      new RangeError(message),
    );
  });
});

describe('Skeleton CSS', () => {
  it('pulses the bars in the quiet fill, still under reduced motion', () => {
    expect(css).toContain(
      'animation: sw-skeleton-pulse calc(2 * var(--sw-motion-travel)) var(--sw-motion-travel-easing) infinite alternate;',
    );
    expect(css).toContain(
      'background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);',
    );
    expect(css).toContain(
      '@media (prefers-reduced-motion: reduce) {\n  .sw-skeleton-bar,\n  .sw-skeleton-mark { animation: none; }\n}',
    );
  });

  it('rags the bars, shortens the last line, and keeps edges in forced colours', () => {
    expect(css).toContain(
      '.sw-skeleton-lines > .sw-skeleton-bar:nth-of-type(2) { width: 92%; }',
    );
    expect(css).toContain(
      '.sw-skeleton-lines > .sw-skeleton-bar:last-of-type:not(:first-of-type) { width: 60%; }',
    );
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-skeleton-bar,\n  .sw-skeleton-mark { border: 1px solid GrayText; }',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-skeleton-row { min-height: var(--sw-control-md-min-height); }',
    );
  });

  it('lays rows out with hairlines between them, kept in forced colours', () => {
    expect(css).toContain(
      '.sw-skeleton-row + .sw-skeleton-row {\n  border-top: 1px solid var(--sw-color-border);\n}',
    );
    expect(css).toContain(
      '.sw-skeleton-row + .sw-skeleton-row { border-color: GrayText; }',
    );
    expect(css).toContain(
      '.sw-skeleton-row .sw-skeleton-bar {\n  flex: 0 1 60%;\n}',
    );
    expect(css).toContain(
      '.sw-skeleton-mark {\n  height: var(--sw-space-6);\n  width: var(--sw-space-6);\n}',
    );
  });

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-skeleton',
        'sw-skeleton-lines',
        'sw-skeleton-rows',
        'sw-skeleton-bar',
        'sw-skeleton-row',
        'sw-skeleton-mark',
      ]),
    );
  });
});
